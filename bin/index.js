#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/* ───────────── helpers ───────────── */

const run = (cmd, cwd = process.cwd()) =>
  execSync(cmd, { cwd, stdio: 'inherit' });

const { readFileSync, writeFileSync, mkdirSync, existsSync } = fs;

/* ─────────── client scaffold ─────────── */

function createClient() {
  const app = 'client';
  console.log('🚀  Scaffolding Vite + React-TS client …');

  // 1 — Vite skeleton (non-interactive)
  run(`npm create vite@latest ${app} -- --template react-ts`);

  const root = path.join(process.cwd(), app);

  // 2 — React Router
  run('npm i react-router-dom@latest axios@latest bootstrap@latest react-icons@latest', root);

// 3—Patch package.json (idempotent but explicit)
const pkgFile = path.join(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));

// Explicitly set versions
pkg.dependencies['react-router-dom'] = '^6';
pkg.dependencies['axios'] = '^1';
pkg.dependencies['bootstrap'] = '^5';
pkg.dependencies['react-icons'] = '^4';
  writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));

  // 4 — src structure
  ['components', 'routes'].forEach(dir =>
    mkdirSync(path.join(root, 'src', dir), { recursive: true })
  );

  // 5 — boiler-plate files
  const write = (rel, txt) => writeFileSync(path.join(root, 'src', rel), txt);

  write('main.tsx', String.raw`import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter><App/></BrowserRouter>
  </React.StrictMode>
);`);

  write('App.tsx', String.raw`import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about/*" element={<About />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}`);

  write('routes/Home.tsx', `
    import React , {useState} from 'react'
    import { Link , useNavigate , useParams } from 'react-router-dom';
    export default function Home() {
    const To = useNavigate();
  return (
    <div>
        <h1>Home</h1>
    </div>
  )
}
    
    `);

  write('routes/About.tsx', String.raw`
    import React , {useState} from 'react'
import { Link , useNavigate , useParams } from 'react-router-dom';
export default function About() {
    const To = useNavigate();
  return (
    <div>
        <h1>About</h1>
    </div>
  )
}
    
    `);

  write('routes/NotFound.tsx', String.raw`import { useLocation } from 'react-router-dom';
export default () => {
  const { pathname } = useLocation();
  return ( <div> <p>No match for “{pathname}”.</p> </div>);
};`);
}

/* ─────────── server scaffold (original) ─────────── */

function createServer() {
  console.log('🚀 Creating Express server with TypeScript…');
  const serverPath = path.join(process.cwd(), 'server');

  if (existsSync(serverPath)) {
    console.error('Error: Folder "server" already exists.');
    process.exit(1);
  }
  mkdirSync(serverPath);
  process.chdir(serverPath);

  // 1. package.json
  run('npm init -y');

  // 2. dependencies
  const pkgPath = path.join(serverPath, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

  pkg.dependencies = {
    express: '5.1.0',
    cors: '*',
    morgan: '*',
    dotenv: '*',
    mongoose: '*',
    ejs: '*'
  };

  pkg.devDependencies = {
    typescript: '*',
    '@types/node': '*',
    '@types/express': '*',
    '@types/cors': '*',
    '@types/morgan': '*',
    '@types/ejs': '*',
    nodemon: '*',
    'ts-node': '*'
  };

  pkg.scripts = {
    build: 'tsc',
    start: 'npm run build && node dist/index.js',
    dev: 'nodemon --watch src/**/*.ts --exec "npx ts-node src/index.ts"'
  };

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // 3. tsconfig
  writeFileSync('tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`);

  // 4. source stub
  mkdirSync('src');
  const tsStub = `
import express, { Request, Response } from 'express';
import cors    from 'cors';
import morgan  from 'morgan';
import mongoose from 'mongoose';

const app  = express();
const port = 3000;
//connect to the db
const main = async ()=>{
    try{
        await mongoose.connect(uri);
        console.log('database conencted');
    }
    catch(err){
        console.log(\`ERROR in connecting: \${err}\`);
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript scaffold!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
`;

  writeFileSync('src/index.ts', tsStub);


  // 5. nodemon
  writeFileSync('nodemon.json', `{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "npx ts-node ./src/index.ts"
}`);

  process.chdir('..');
  console.log('✅ Express server setup complete!');
}

/* ─────────── root scaffold (classic) ─────────── */

function createRootPackage(projectName, root) {
  console.log('🚀 Creating root package.json …');

  const rootPackage = {
    name: projectName,
    version: '1.0.0',
    description: '',
    type: 'commonjs',
    scripts: {
      preinstall: "cd client && npm install && cd ../server && npm install && cd ..",
      start: 'concurrently "npm run server" "npm run client"',
      server: 'cd server && npm start',
      client: 'cd client && npm run dev'
    },
    keywords: [],
    author: '',
    license: 'ISC',
    dependencies: {
      concurrently: '^9.1.2'
    }
  };

  const rootPkgPath = path.join(root, 'package.json');
  writeFileSync(rootPkgPath, JSON.stringify(rootPackage, null, 2));
}

function createReadme(projectName, rootPath) {
  writeFileSync(
    path.join(rootPath, 'README.md'),
    String.raw`# ${projectName}

This project contains two apps:

| folder | tech | dev command |
| ------ | ---- | ----------- |
| \`client/\` | Vite + React + React-Router | \`npm run dev\` inside **client** |
| \`server/\` | Express 5 (beta) + TypeScript | \`npm run dev\` inside **server** |

## Setup

\`\`\`bash
cd ${projectName}
npm install            # installs root (only "concurrently")
cd client && npm install
cd ../server && npm install
cd ..
npm start              # runs client + server via concurrently
\`\`\`
`
  );
}

/* ─────────── overall scaffold ─────────── */

function createProject(name) {
  const root = path.join(process.cwd(), name);
  if (existsSync(root)) {
    console.error('Error: folder already exists'); process.exit(1);
  }
  mkdirSync(root);
  process.chdir(root);

  createClient();
  createServer();
  createRootPackage(name, root);
  createReadme(name, root);

  console.log(`\n✅  Project “${name}” created.`);
  console.log(`Next steps:\n  cd ${name}\n  npm install && (cd client && npm install && cd ../server && npm install)\n  npm start`);
}

/* ─────────── CLI wiring ─────────── */

program
  .name('ad-app')
  .version('2.0.0')
  .description('Scaffold React (Vite + Router) + Express/TS mono-repo');

program
  .command('new <project-name>')
  .description('Create a new full-stack project')
  .action(createProject);

program.parse();

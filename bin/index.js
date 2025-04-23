#!/usr/bin/env node
import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/* ───────────────────────── helpers ───────────────────────── */

const run = (cmd, cwd = process.cwd()) =>
  execSync(cmd, { cwd, stdio: 'inherit' });

const { readFileSync, writeFileSync, mkdirSync, existsSync } = fs;

/* ─────────────────────── client scaffold ─────────────────── */

function createClient() {
  const app = 'client';
  console.log('🚀  Scaffolding Vite + React-TS client …');

  // 1 — Vite skeleton (non-interactive)
  run(`npm create vite@latest ${app} -- --template react-ts`);

  const root = path.join(process.cwd(), app);

  // 2 — React Router (types already included)
  run('npm i react-router-dom@latest', root);

  // 3 — patch package.json
  const pkgFile = path.join(root, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  pkg.dependencies['react-router-dom'] = '^6';
  writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));

  // 4 — src structure
  ['components', 'routes'].forEach(dir =>
    mkdirSync(path.join(root, 'src', dir), { recursive: true })
  );

  // 5 — boiler-plate files
  const write = (rel, txt) =>
    writeFileSync(path.join(root, 'src', rel), txt);

  write('main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter><App/></BrowserRouter>
  </React.StrictMode>
);`);

  write('App.tsx', `import { Routes, Route, Navigate } from 'react-router-dom';
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

  write('routes/Home.tsx', 'export default () => <h1>Home</h1>;');
  write('routes/About.tsx', `import { Outlet, Link } from 'react-router-dom';
export default () => <>
  <h1>About</h1>
  <nav><Link to="services">Services</Link> | <Link to="history">History</Link></nav>
  <Outlet/>
</>;`);
  write('routes/NotFound.tsx', `import { useLocation } from 'react-router-dom';
export default () => {
  const { pathname } = useLocation();
  return <p>No match for “{pathname}”.</p>;
};`);
}

/* ─────────────────────── server scaffold ─────────────────── */

function createServer() {
  console.log('🚀  Creating Express server …');
  const serverPath = path.join(process.cwd(), 'server');
  if (existsSync(serverPath)) {
    console.error('Error: "server" already exists'); process.exit(1);
  }
  mkdirSync(serverPath);
  process.chdir(serverPath);

  // package.json
  run('npm init -y', serverPath);
  const pkgFile = path.join(serverPath, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));

  pkg.dependencies = {
    express: '^4.19.2',
    cors: '^2',
    morgan: '^1',
    dotenv: '^16',
    mongoose: '^8',
    ejs: '^3'
  };
  pkg.devDependencies = {
    typescript: '^5',
    '@types/node': '^20',
    '@types/express': '^4',
    '@types/cors': '^2',
    '@types/morgan': '^1',
    '@types/ejs': '^3',
    nodemon: '^3',
    'ts-node': '^10'
  };
  pkg.scripts = {
    build: 'tsc',
    start: 'node dist/index.js',
    dev: 'nodemon'
  };
  writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));

  // tsconfig
  writeFileSync('tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  }
}`);

  // src/index.ts
  mkdirSync('src');
  writeFileSync('src/index.ts', `import express from 'express';
import cors from 'cors'; import morgan from 'morgan';
const app = express(); const port = 3000;
app.use(express.json(), cors(), morgan('dev'));
app.get('/', (_, res) => res.send('Hello World'));
app.listen(port, () => console.log('API on http://localhost:' + port));
`);

  // nodemon.json
  writeFileSync('nodemon.json', `{
  "watch": ["src"],
  "ext": "ts",
  "exec": "npx ts-node src/index.ts"
}`);
  process.chdir('..');
  console.log('✅  Express server ready');
}

/* ────────────────────── mono-repo scaffold ───────────────── */

function createRootPackage(projectName, root) {
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({
    name: projectName,
    private: true,
    scripts: {
      preinstall: 'npm install --prefix server && npm install --prefix client',
      start: 'concurrently "npm run dev -w client" "npm start -w server"'
    },
    devDependencies: { concurrently: '^9' }
  }, null, 2));
}

function createReadme(projectName, root) {
  writeFileSync(path.join(root, 'README.md'), `# ${projectName}

Run everything:

\`\`\`bash
npm install          # installs root + both workspaces
npm start            # client + server concurrently
\`\`\`
`);
}

function createProject(name) {
  const root = path.join(process.cwd(), name);
  if (existsSync(root)) { console.error('Folder exists'); process.exit(1);}
  mkdirSync(root); process.chdir(root);

  createClient();
  createServer();
  createRootPackage(name, root);
  createReadme(name, root);

  console.log(`\n✅  Project “${name}” ready - cd ${name} && npm install`);
}

/* ──────────────────────── CLI wiring ────────────────────── */

program
  .name('ad-app')
  .version('2.0.0')
  .description('Scaffold React (Vite + Router) + Express/TS mono-repo');

program
  .command('new <project-name>')
  .action(createProject);

program.parse();

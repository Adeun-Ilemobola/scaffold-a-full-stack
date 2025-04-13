#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Create the client application using create-react-router
 */
function createClient() {
  console.log('🚀 Creating React client with Vite and React Router...');
  try {
    execSync('npx create-react-router@latest client', { stdio: 'inherit' });
  } catch (err) {
    console.error('Error creating the client app:', err);
    process.exit(1);
  }
}

/**
 * Scaffold the Express server with TypeScript.
 */
function createServer() {
  console.log('🚀 Creating Express server with TypeScript...');
  const serverPath = path.join(process.cwd(), 'server');

  if (fs.existsSync(serverPath)) {
    console.error('Error: Folder "server" already exists.');
    process.exit(1);
  }
  fs.mkdirSync(serverPath);
  process.chdir(serverPath);

  // 1. Initialize package.json for server
  console.log('Initializing server package.json...');
  try {
    execSync('npm init -y', { stdio: 'inherit' });
  } catch (err) {
    console.error('Error running npm init -y in server:', err);
    process.exit(1);
  }

  // 2. Update package.json with server dependencies and scripts
  console.log('Updating server package.json...');
  const serverPackageJsonPath = path.join(process.cwd(), 'package.json');
  let serverPackage = JSON.parse(fs.readFileSync(serverPackageJsonPath, 'utf8'));
  
  serverPackage.dependencies = {
    "express": "5.0.1",
    "cors": "*",
    "morgan": "*",
    "dotenv": "*",
    "mongoose": "*",
    "ejs": "*"
  };

  serverPackage.devDependencies = {
    "typescript": "*",
    "@types/node": "*",
    "@types/express": "*",
    "@types/cors": "*",
    "@types/morgan": "*",
    "@types/ejs": "*",
    "nodemon": "*",
    "ts-node": "*"
  };

  serverPackage.scripts = {
    "build": "tsc",
    "start": "npm run build && node dist/index.js",
    "dev": "nodemon --watch src/**/*.ts --exec \"npx ts-node src/index.ts\""
  };

  fs.writeFileSync(serverPackageJsonPath, JSON.stringify(serverPackage, null, 2));

  // 3. Create tsconfig.json
  console.log('Creating tsconfig.json for server...');
  const tsConfigContent = `{
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
}
`;
  fs.writeFileSync(path.join(process.cwd(), 'tsconfig.json'), tsConfigContent);

  // 4. Create src directory and index.ts
  console.log('Creating source files for server...');
  const srcDir = path.join(process.cwd(), 'src');
  fs.mkdirSync(srcDir);
  const indexTsContent = `import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript scaffold!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
`;
  fs.writeFileSync(path.join(srcDir, 'index.ts'), indexTsContent);

  // 5. Create nodemon.json
  console.log('Creating nodemon configuration for server...');
  const nodemonContent = `{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "npx ts-node ./src/index.ts"
}
`;
  fs.writeFileSync(path.join(process.cwd(), 'nodemon.json'), nodemonContent);

  // Move back to the root project directory
  process.chdir('..');
  console.log('✅ Express server setup complete!');
}

/**
 * Create the root package.json for the overall project.
 */
function createRootPackage(projectName, projectPath) {
  console.log('🚀 Creating root package.json...');
  const rootPackage = {
    name: projectName,
    version: "1.0.0",
    description: "",
    scripts: {
      start: "concurrently \"npm run server\" \"npm run client\"",
      server: "cd server && npm start",
      client: "cd client && npm run dev"
    },
    keywords: [],
    author: "",
    license: "ISC",
    type: "commonjs",
    dependencies: {
      concurrently: "^9.1.2"
    }
  };

  const rootPackagePath = path.join(projectPath, 'package.json');
  fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2));
}

/**
 * Create README.md with instructions.
 */
function createReadme(projectName, projectPath) {
  console.log('🚀 Creating README.md with usage instructions...');
  const readmeContent = `# ${projectName}

This project contains two applications:

- **client:** A React application scaffolded with Vite and React Router.
- **server:** An Express server written in TypeScript.

## Available Scripts

In the root directory, you can run:

### \`npm start\`
Runs both the client and server concurrently using [concurrently](https://www.npmjs.com/package/concurrently).

### \`npm run client\`
Starts the React development server.

### \`npm run server\`
Starts the Express server.

## Setup

1. Navigate to the project folder:
   \`\`\`bash
   cd ${projectName}
   \`\`\`

2. Install all dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. To start development servers, run:
   \`\`\`bash
   npm start
   \`\`\`

## Additional Configuration

- The **client** was generated using \`npx create-react-router@latest client\`.
- The **server** setup includes an Express server configured to work with TypeScript. Modify \`src/index.ts\` for custom routes or middleware.
`;
  fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);
}

/**
 * Main function to create the full-stack project
 */
function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  // 1) Check if project folder exists
  if (fs.existsSync(projectPath)) {
    console.error(`Error: Folder "${projectName}" already exists in this directory.`);
    process.exit(1);
  }

  // 2) Create project folder
  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    console.error(`Error creating folder "${projectName}":`, err);
    process.exit(1);
  }

  // 3) Navigate into project folder
  process.chdir(projectPath);
  console.log(`\nCreated project folder: ${projectPath}\n`);

  // 4) Create Client using npx command
  createClient();

  // 5) Create Express Server
  createServer();

  // 6) Create the root package.json and README.md
  createRootPackage(projectName, projectPath);
  createReadme(projectName, projectPath);

  console.log('\n✅ Full-stack project setup complete!\n');
  console.log(`Next steps:
  1) Navigate to your new project: cd ${projectName}
  2) Run "npm install" to install root dependencies.
  3) Then, in each subfolder ("client" and "server"), run "npm install" if needed.
  4) Run "npm start" to launch both client and server concurrently.
  `);
}

program
  .name('ad-app')
  .description('CLI to scaffold a full-stack project with a React client (Vite/React Router) and an Express server (TypeScript).')
  .version('2.0.0');

program
  .command('new <project-name>')
  .description('Create a new full-stack project.')
  .action((projectName) => {
    createProject(projectName);
  });

program.parse(process.argv);

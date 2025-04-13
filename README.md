

```markdown
# ad-app

`ad-app` is a CLI tool for scaffolding a full-stack project that consists of:
- A **client** built with React (using Vite and React Router)
- A **server** built with Express

The generated project will include a root-level `package.json` that uses [concurrently](https://www.npmjs.com/package/concurrently) to run both client and server together.

## Installation

Install the CLI globally on your system:

```bash
npm install -g ad-app
```

## How to Use

To scaffold a new full-stack project, run:

```bash
npx ad-app new <project-name>
```

Replace `<project-name>` with your desired project folder name. This command creates a new directory with the following structure:

```
<project-name>/
├── client/         # React app (Vite + React Router)
├── server/         # Express server
├── package.json    # Root package.json for running both apps concurrently
└── README.md       # Project-specific instructions
```

## Setting Up Your Project

After the CLI scaffolds your project, follow these steps to install dependencies and start your application:

1. **Navigate to the Project Directory**

   ```bash
   cd <project-name>
   ```

2. **Install Root Dependencies**

   The root `package.json` includes the dependency for `concurrently`, which helps run both the client and server together. Install them by running:

   ```bash
   npm install
   ```

3. **Install Client Application Dependencies**

   Navigate into the `client` folder and install its dependencies:

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install Server Application Dependencies**

   Then, navigate into the `server` folder and install its dependencies:

   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Run Your Full-Stack Application**

   With all dependencies installed, launch your application from the project root:

   ```bash
   npm run start
   ```

   This command uses `concurrently` to start both the client and server simultaneously.

## Additional Commands

Depending on your needs, you might also use the following commands from the project root (provided they are defined in your generated `package.json`):

- **Run Only the Client:**

  ```bash
  npm run client
  ```

- **Run Only the Server:**

  ```bash
  npm run server
  ```

## Troubleshooting

- **CLI Command Not Found:**  
  If `ad-app` is not recognized, ensure you installed it globally with:
  
  ```bash
  npm install -g ad-app
  ```
  
  Also, verify that your system's global npm directory is included in your PATH.

- **Dependency Issues:**  
  Make sure you have a recent stable version of [Node.js](https://nodejs.org/) and npm installed.




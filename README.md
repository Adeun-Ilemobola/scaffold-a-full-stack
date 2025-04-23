@@ Installation
-Install the CLI globally on your system:
+Install the CLI globally (or use `npx` every time):

@@ How to Use
-To scaffold a new full-stack project, run:
+Scaffold a new project with:

@@ Setting Up Your Project
-2. **Install Root Dependencies**
-   The root `package.json` includes the dependency for `concurrently`, which helps run both the client and server together. Install them by running:
-
-   ```bash
-   npm install
-   ```
-
-3. **Install Client Application Dependencies**
-   Navigate into the `client` folder and install its dependencies:
+2. **Install All Dependencies**
+   One command installs everything (root + apps) because the root `preinstall` hook
+   already runs `npm install` in *client* and *server*:
 
    ```bash
-   cd client
+   npm install
    npm install
-   cd ..
    ```
-
-4. **Install Server Application Dependencies**
-   Then, navigate into the `server` folder and install its dependencies:
-
-   ```bash
-   cd server
-   npm install
-   cd ..
-   ```
-
-5. **Run Your Full-Stack Application**
+3. **Run Your Full-stack Application**


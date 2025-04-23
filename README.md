<p align="center">
  <img src="https://shields.io/badge/ad--app-Full-Stack%20Scaffolder-7B3DF3?logo=npm&logoColor=white" alt="ad-app banner">
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/ad-app?label=npm%20@latest&color=cb3837)](https://www.npmjs.com/package/ad-app)
[![Weekly downloads](https://img.shields.io/npm/dw/ad-app?color=brightgreen&label=downloads)](https://www.npmjs.com/package/ad-app)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0-F6E05E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/ad-app?color=blue)](LICENSE)

</div>

---

`ad-app` is a one-command **full-stack scaffold**:

| folder | tech stack | dev command |
| ------ | ---------- | ----------- |
| **client** | Vite • React • React Router | `npm run dev -w client` |
| **server** | Express 4 • TypeScript | `npm start -w server` |

The root project runs both with **concurrently**.

---

## ✨ Quick Start

```bash
npx ad-app new my-cool-app      # yarn dlx / pnpm dlx also work
cd my-cool-app
npm install                     # installs root **+** client **+** server
npm start                       # launches both apps

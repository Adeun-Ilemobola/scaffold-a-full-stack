<!-- ──────────────────────────────────────────────────────────────────────────── -->
<!--  ad-app – README TEMPLATE                                                  -->
<!--  copy-paste this whole file directly into createReadme() *or* your repo    -->
<!-- ──────────────────────────────────────────────────────────────────────────── -->

<p align="center">
  <img src="https://img.shields.io/badge/ad--app-Full-Stack%20Scaffolder-7B3DF3?logo=npm&logoColor=white" alt="ad-app banner">
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/ad-app?label=npm%20@latest&color=cb3837)](https://www.npmjs.com/package/ad-app)
[![downloads](https://img.shields.io/npm/dw/ad-app?color=brightgreen&label=downloads)](https://www.npmjs.com/package/ad-app)
[![Node](https://img.shields.io/badge/node-%E2%89%A518.x-brightgreen?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/npm/l/ad-app?color=blue)](LICENSE)

</div>

---

✨ **ad-app** spins up a modern **React + Vite** front-end and an **Express 5 (beta) + TypeScript** API in seconds.

| folder        | stack                                             | dev command            |
| ------------- | ------------------------------------------------- | ---------------------- |
| **client/**   | Vite • React • React Router v6                    | `npm run dev -w client` |
| **server/**   | Express 5 (beta) • TypeScript • Nodemon           | `npm start -w server`  |

Everything runs together using **concurrently**.

---

## 🚀 Install the CLI

| Install style | Command |
| ------------- | ------- |
| **Global (recommended)** | `npm i -g ad-app` |
| **One-off (no globals)** | `npx ad-app <cmd>` (works with `pnpm dlx` & `yarn dlx` too) |

---

## ⚡ Quick start — 3 commands

```bash
ad-app new my-app        # or: npx ad-app new my-app
cd my-app
npm install && npm start # 1) installs everything (client+server) via preinstall
                         # 2) launches both apps

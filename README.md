const readmeContent = String.raw`# ${projectName}

\`ad-app\` scaffolds a full-stack monorepo:

| folder | tech | dev command |
|--------|------|-------------|
| \`client/\` | Vite + React + React-Router | \`npm run dev -w client\` |
| \`server/\` | Express + TypeScript | \`npm start -w server\` |

The root uses **concurrently** to run them together.

## Quick start

\`\`\`bash
cd ${projectName}
npm install       # installs root + client + server
npm start         # launches both apps
\`\`\`

## Global CLI install

\`\`\`bash
npm install -g ad-app         # once
ad-app new my-project         # anywhere
\`\`\`

*(or keep using \`npx ad-app\` if you prefer not to install globally)*

## Troubleshooting

- **Command not found** → ensure your global npm bin dir is on \`$PATH\`.
- **Old Node** → requires Node 18 +.

Happy hacking! 🚀
`;

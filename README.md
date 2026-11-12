# Benga Grammar Website

Interactive website teaching the Benga language, based on Salvado y Cos's grammar.
Built with Vue 3 + Vite. Project rules for humans and AI: [AGENTS.md](AGENTS.md).
Plan and progress: [docs/ROADMAP.md](docs/ROADMAP.md).

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install the dependencies (once, or after `package.json` changes) |
| `npm run serve` | Development server with live reload: http://localhost:8080 |
| `npm run build` | Build the site for publishing into `dist/` |
| `npm run preview` | Serve the built `dist/` locally: http://localhost:8081 |
| `npm run lint` | Check the code for mistakes (ESLint) |
| `npm run format` | Format all code (Prettier) |
| `npm test` | Run the automatic tests |
| `npm run words:sync` | Update the word registry after changing content ([guide](docs/WORD-REGISTRY.md)) |
| `npm run words:check` | Same report without changing files |
| `npm run words:import -- list.csv` | Fill the word registry from a spreadsheet |

# Oldbook Chess

A minimalist, no-account online chess app — play against a strong Stockfish-powered bot, styled with a parchment / old-book aesthetic.

![Oldbook Chess](demo.png)

## Features

- ♟️ Play chess against a bot — no login, no account, no server backend
- 🧠 Bot powered by **Stockfish 18** (WASM), running entirely in your browser
- 🎚️ Adjustable difficulty (Skill Level 0–20, from Beginner to Grandmaster)
- ⬜⬛ Choose to play as White or Black — board flips automatically when playing Black
- 📜 Parchment / old-book visual theme (via [oldbook-css](https://github.com/UtilityHotbar/oldbook-css))
- ♔♕♖ Unicode chess pieces — no image assets needed
- ✅ Full legal move validation (check, checkmate, stalemate, draw detection)

## Tech Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [chess.js](https://github.com/jhlywa/chess.js) — chess rules & move validation
- [Stockfish](https://www.npmjs.com/package/stockfish) (lite-single WASM build) — chess engine, run as a Web Worker
- [oldbook-css](https://github.com/UtilityHotbar/oldbook-css) — parchment theme

## Project Structure

```
oldbook-chess/
├── public/
│   ├── oldbook.css
│   └── stockfish/
│       ├── stockfish-18-lite-single.js
│       └── stockfish-18-lite-single.wasm
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── components/
│   │   ├── ChessBoard.vue
│   │   ├── GameStatus.vue
│   │   └── DifficultySelector.vue
│   └── composables/
│       ├── useChessGame.js
│       └── useStockfish.js
├── index.html
├── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone <this-repo-url>
cd oldbook-chess
npm install
```

### Run in development

```bash
npm run dev
```

Then open the local URL shown in your terminal (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Output will be in the `dist/` folder — deploy it to any static hosting.

## How It Works

- **Move validation & game state** are handled entirely client-side by `chess.js`, tracked via FEN notation.
- **The bot** runs [Stockfish 18](https://stockfishchess.org/) compiled to WebAssembly, loaded as a Web Worker (`public/stockfish/`). It communicates via the standard [UCI protocol](https://github.com/official-stockfish/Stockfish/wiki/UCI-%26-Commands).
- **No backend, no database, no accounts** — all state lives in memory for the duration of the session.

## Credits

- Chess engine: [Stockfish](https://stockfishchess.org/) by the Stockfish community, WASM build by [nmrugg/stockfish.js](https://github.com/nmrugg/stockfish.js)
- Chess rules engine: [chess.js](https://github.com/jhlywa/chess.js)
- Visual theme: [oldbook-css](https://github.com/UtilityHotbar/oldbook-css) by UtilityHotbar

## License

Stockfish is licensed under **GPLv3**. See [Stockfish's license](https://github.com/official-stockfish/Stockfish/blob/master/Copying.txt) for terms regarding distribution.

oldbook-css is licensed under **MIT**.

This project's own code: _(add your preferred license here, e.g. MIT)_

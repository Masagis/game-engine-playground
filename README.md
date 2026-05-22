# 🎮 Game Engine Playground

A mini 2D game-engine playground built with **Vue 3**, **Tailwind CSS v4**, and the **HTML5 Canvas API**. Manipulate a character or sprite in real-time using keyboard and mouse controls, while observing live debug telemetry — position, rotation, scale, FPS, and active key inputs — all rendered on a sleek, dark-themed interface.

![License](https://img.shields.io/badge/license-MIT-blue)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)

---

## ✨ Features

- **Real-time Canvas Rendering** — Smooth 60 FPS game loop powered by `requestAnimationFrame`
- **Keyboard & Mouse Controls** — Move (WASD / Arrow Keys), rotate (Q / E), scale (Scroll Wheel), and drag objects
- **Dual Object Modes** — Switch between a procedurally-drawn robot character and a sprite-sheet animation
- **Live Debug Panel** — Real-time display of position, rotation, scale, direction, FPS, and active key indicators
- **State Persistence** — Save and load object state via `localStorage`
- **Click Effects** — Particle burst and ripple animations on object interaction
- **Dark Theme UI** — Premium glassmorphism panels with smooth transitions and micro-animations

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- A package manager: **npm**, **yarn**, or **pnpm**

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/masagis/game-engine-playground.git
cd game-engine-playground
```

**Using npm:**

```bash
npm install
```

**Using yarn:**

```bash
yarn install
```

**Using pnpm:**

```bash
pnpm install
```

### Running Development Server

**Using npm:**

```bash
npm run dev
```

**Using yarn:**

```bash
yarn dev
```

**Using pnpm:**

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production

**Using npm:**

```bash
npm run build
npm run preview    # preview the production build
```

**Using yarn:**

```bash
yarn build
yarn preview
```

**Using pnpm:**

```bash
pnpm build
pnpm preview
```

### Linting & Formatting

```bash
# Lint (ESLint)
npm run lint        # or: yarn lint / pnpm lint

# Format (Prettier)
npm run format      # or: yarn format / pnpm format
```

---

## 🎹 Controls

| Input             | Action           |
| ----------------- | ---------------- |
| `W` / `↑`         | Move up          |
| `A` / `←`         | Move left        |
| `S` / `↓`         | Move down        |
| `D` / `→`         | Move right       |
| `Q`               | Rotate left      |
| `E`               | Rotate right     |
| `Scroll Wheel`    | Scale up / down  |
| `Click on object` | Drag + particles |

---

## 📁 Project Structure

```
game-engine-playground/
├── public/
│   └── favicon.svg               # SVG favicon (ATW logo)
│
├── src/
│   ├── assets/
│   │   └── sprite.png            # Sprite sheet (4-frame animation)
│   │
│   ├── components/
│   │   ├── GameCanvas.vue        # Main canvas — rendering, game loop, draw logic
│   │   ├── ControlPanel.vue      # UI panel — object type switch, action buttons, shortcuts
│   │   └── DebugPanel.vue        # Debug overlay — position, rotation, scale, FPS, active keys
│   │
│   ├── hooks/
│   │   ├── useGameLoop.js        # Composable: requestAnimationFrame loop + FPS counter
│   │   ├── useGameObject.js      # Composable: object state, physics, movement, click effects
│   │   └── useInputManager.js    # Composable: keyboard + mouse input tracking
│   │
│   ├── App.vue                   # Root component — layout, panels, toast notifications
│   ├── main.js                   # App entry point
│   └── style.css                 # Global styles, Tailwind theme tokens, keyframes
│
├── .eslintrc.js                  # ESLint config (Vue 3 + Prettier)
├── .prettierrc.json              # Prettier formatting rules
├── .commitlintrc.json            # Commitlint config (Conventional Commits)
├── .husky/
│   ├── pre-commit                # Runs lint-staged before each commit
│   └── commit-msg                # Validates commit messages with commitlint
│
├── index.html                    # HTML entry point
├── vite.config.js                # Vite config (Vue + Tailwind CSS plugins)
├── package.json                  # Dependencies, scripts, lint-staged config
└── README.md
```

### Key Files Explained

#### `src/components/GameCanvas.vue`

The core of the playground. Contains the `<canvas>` element and all rendering logic — grid, character (procedurally drawn with gradients and glows), sprite sheet animation, click particle effects, and drag indicators. Wires together the three composables to form the game loop.

#### `src/components/DebugPanel.vue`

A real-time debug overlay styled as a terminal-like panel. Displays X/Y position, rotation angle, scale factor, horizontal/vertical direction, FPS counter, and a keyboard visualizer that highlights currently pressed keys.

#### `src/components/ControlPanel.vue`

Provides interactive controls: object type selector (Character vs Sprite), action buttons (Reset, Save, Load), and a quick-reference keyboard shortcut guide.

#### `src/hooks/useGameLoop.js`

A composable that manages the `requestAnimationFrame` loop. Calls `update(dt)` and `render(dt)` each frame, caps delta time at 50ms to prevent physics explosions, and calculates a rolling FPS average.

#### `src/hooks/useGameObject.js`

Manages all game object state — position, velocity, rotation, scale, direction. Implements acceleration-based movement with friction, boundary clamping, mouse wheel scaling, drag-and-drop, sprite animation frames, and click particle effects.

#### `src/hooks/useInputManager.js`

Handles keyboard and mouse input. Tracks pressed keys in a reactive `Set`, captures mouse position relative to the canvas, and provides `consumeClick()` / `consumeWheel()` helpers for one-shot input consumption. Includes safeguards against stuck keys when modifier shortcuts steal focus.

---

## 🛠️ Tech Stack

| Category           | Technology                                                            |
| ------------------ | --------------------------------------------------------------------- |
| **Framework**      | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)      |
| **Build Tool**     | [Vite 8](https://vite.dev/) — instant HMR, ESM-native bundling        |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/) — utility-first, `@theme` |
| **Rendering**      | HTML5 Canvas API — 2D context for game rendering                      |
| **Linting**        | [ESLint](https://eslint.org/) + `eslint-plugin-vue`                   |
| **Formatting**     | [Prettier](https://prettier.io/)                                      |
| **Git Hooks**      | [Husky](https://typicode.github.io/husky/)                            |
| **Commit Linting** | [Commitlint](https://commitlint.js.org/) (Conventional Commits)       |
| **Language**       | JavaScript (ES Modules)                                               |

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Agis Tri Wahyuji** — [@masagis](https://github.com/masagis)

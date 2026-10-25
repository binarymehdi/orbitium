# Orbitium — web

React 19 + Vite front end: the React Flow canvas, the Monaco task editor, and the pipeline list. See the [root README](../../README.md) for the full setup.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run test      # vitest
```

Set `VITE_API_URL` to point at the API if it is not on `http://localhost:8000/api/v1`.

Routes are file-based under `src/routes` (TanStack Router). Feature code lives in `src/features/*`; shared API client, store and UI primitives in `src/shared/*`. UI components come from shadcn (`npx shadcn@latest add <component>`).

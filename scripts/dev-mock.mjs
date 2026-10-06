// Starts the app with a throwaway save that has a level 15 Pokemon ready to evolve.
// Uses its own save location, so your real progress is never touched.
import { spawn } from 'node:child_process'

const env = { ...process.env, RENDERER_VITE_MOCK: 'evo', POKESTUDY_MOCK: '1' }
// Some editors set this, which makes Electron start as plain Node and crash
delete env.ELECTRON_RUN_AS_NODE
const child = spawn('npx', ['electron-vite', 'dev'], { stdio: 'inherit', shell: true, env })
child.on('exit', (code) => process.exit(code ?? 0))

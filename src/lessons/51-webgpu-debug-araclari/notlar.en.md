# Lesson 51 — WebGPU debug tools

## Topic

**Spector.js** is a WebGL frame capturer: draw call,
program, texture, buffer. This course uses
**WebGPURenderer**.
Spector.js does **not** capture the WebGPU command stream.

In Chrome in 2026 there is no built-in “WebGPU” panel.
Don't turn on old `chrome://flags` WebGPU rows — not
needed.

What is left?

1. Console + `window.__egitim.info()`
2. `chrome://gpu` (Hardware accelerated?)
3. Optional extension: **WebGPU Inspector**
4. If the backend is WebGL2, then Spector.js makes sense

## How it works

```
WebGL  → Spector.js / old WebGL profiler
WebGPU → validation messages + renderer.info + gpu page
```

Look at the HUD `backend` line. If it says “WebGPU”,
Spector comes back empty; that is not a bug.

## Code

Buttons print different `console.info` depending on the
backend.
The scene is just a torus to look at — a tools lesson.

## Try this

1. Write the backend. Is `navigator.gpu` an object, or
   undefined?
2. Open chrome://gpu. Read the WebGPU line.
3. Install Spector and try (optional). Why empty on
   WebGPU?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
window.__egitim.info().compute.frameCalls
```

- No flag
- chrome://gpu yes
- Spector.js: only WebGL2 fallback

## Mini task

Note the `getBackendAdi` output somewhere. If the same
machine has no WebGPU, why does the course still open?
(WebGL2 fallback)

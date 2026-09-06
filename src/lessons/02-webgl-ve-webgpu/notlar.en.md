# Lesson 2 — WebGL and WebGPU

## Topic

**WebGL 2** is the old OpenGL ES 3.0 bridge. **WebGPU** is
the modern GPU API: it brings the Vulkan / Metal / D3D12
model into the browser.

Why? Less driver cost, explicit **compute**, explicit
**command buffer**. Three.js `WebGPURenderer` talks to both;
you don't write draw calls.

In a real project every `WebGPURenderer` scene uses this
path. No flag needed.

## How it works

```
CPU (Three.js)
  → Queue
    → Command Buffer
      → Render Pass
        → Pipeline + Bind Group
          → GPU
```

- **Command buffer** — “draw this” records
- **Render pass** — one paint pass to a target (color /
  depth)
- **Pipeline** — vertex + fragment program + state
- **Bind group** — uniform, texture, sampler pack

In WebGL these pieces are scattered `gl.` calls. In WebGPU
they are objects. At Three.js-dev level you don't write a
pipeline; the renderer builds it.

## Code

`renderer.backend.isWebGPUBackend` is the real backend.
`navigator.gpu.requestAdapter()` picks the device.
`adapter.info` gives vendor / architecture. In this lesson
one cube = one draw path.

## Try this

1. Backend button. WebGPU or WebGL 2? Guess, then look.
2. If `navigator.gpu` is missing, does the renderer still
   run?
3. If `adapter.info` returns empty strings, what does that
   mean? (privacy)

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
await navigator.gpu?.requestAdapter()
  .then((a) => a?.info)
```

- `chrome://gpu` → WebGPU: Hardware accelerated
- Spector.js only if the backend is **WebGL 2**
- No flag needed

## Mini task

Without deleting the cube, write `adapter.info.vendor` on
the HUD. Does vendor change when backend doesn't? Why?

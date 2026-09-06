# Lesson 1 — How does the GPU work?

## Topic

**GPU** (Graphics Processing Unit) runs the same small
operation thousands of times at once. **CPU** does complex
work with few cores. The GPU runs the same program for
every vertex and every pixel on thousands of small cores.

Why use it? 1920×1080 × 60 FPS ≈ 124 million pixel
decisions. A CPU cannot do that one by one.

In a real project every 3D scene, product viz, shader, and
particle goes through the GPU.

## How it works

```
CPU (Three.js)
  → Draw Call
GPU
  → Vertex → Triangle → Rasterization → Fragment → Framebuffer → Screen
```

- **Vertex** — processed corner
- **Triangle** — GPU's basic shape
- **Draw Call** — the “draw this” command
- **Fragment** — a pixel candidate of a triangle
- **Framebuffer** — frame buffer
- **Render pipeline** — the path from vertex to screen

`BoxGeometry` produces 24 vertices and 36 indices even
though you see 8 corners. The +1 inside HUD `triangles` is
the renderer's output pass triangle.

## Code

`BoxGeometry` produces a buffer. `Mesh` fills triangles,
`WireframeGeometry` draws edges, `Points` turns vertices
into points. Each visible object ≈ 1 draw call.

## Try this

1. Segments `1` → `8`. Why do triangles increase?
2. Turn off wireframe / vertices. Why do drawCalls drop?
3. Add 5 meshes. Why doesn't it stay at 1 draw call?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `render.drawCalls` — this frame
- `render.calls` — since the app started, always rising
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add `SphereGeometry(1, 8, 8)` and `(1, 32, 32)`. Triangles
change, draw call stays the same. Why?

# Lesson 30 — Particle systems

## Topic

A **particle** is not a triangle mesh by itself; it is a
**point**.
Thousands of points are enough for smoke, stars, sparks,
snow.

Why use it? 10,000 separate `Mesh` ≈ 10,000 **draw calls**.
10,000 `Points` ≈ **1 draw call**. The GPU reads every
point in parallel.

In a real project: rain, sparks, UI confetti, space dust.

## How it works

```
CPU: Float32Array writes positions
  → BufferAttribute (GPU buffer)
    → BufferGeometry
      → Points (one draw)
GPU: each vertex = one point
```

**Attribute** — the array the geometry holds on the GPU.
`position` itemSize 3: `x,y,z, x,y,z, ...`

Every frame the CPU writes the `array` and says
`needsUpdate = true`.
The upload eats the CPU→GPU bus. That is why GPU particles
are strong:
the shader writes position, no upload.

## Code

`BufferGeometry.setAttribute("position", new BufferAttribute(dizi, 3))`
then `new Points(geo, PointsMaterial)`. HUD `points` rises,
`drawCalls` stays one. The slider changes the count; mesh
count stays 1.

## Try this

1. Count 200 → 12000. What happens to FPS and `points`,
   `drawCalls`?
2. Turn **CPU write** off. Why does it stop?
3. `size` 0.045 → 0.2. Does the point stay 1px on WebGPU?

## Browser DevTools

Don't use Spector.js; it does not see WebGPU frames.

```js
window.__egitim.info()
```

- `render.points` — points this frame
- `render.drawCalls` — should stay around 1
- `chrome://gpu` → WebGPU: Hardware accelerated

## Mini task

Add a `color` attribute (itemSize 3) to each point. Paint
points near the center warm, far ones cold.
`PointsMaterial.vertexColors`.

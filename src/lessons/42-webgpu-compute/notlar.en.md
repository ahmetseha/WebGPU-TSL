# Lesson 42 — WebGPU Compute

## Topic

A **compute shader** — general compute that runs on the
GPU without drawing triangles. Vertex/fragment “produce an
image”; compute “write data”.

Why? Updating 12,000 particle positions in a CPU loop eats
the frame budget. The GPU runs thousands of threads at
once.

In a real project: particles, cloth, fluids, GPU culling.

## How it works

```
CPU: compute(node, count) command
GPU: each instanceIndex is one particle
  → storage buffer (instancedArray)
  → positionNode = buffer.toAttribute()
  → Points draw
```

`renderer.info.compute.frameCalls` is the compute pass
this frame.
`drawCalls` is separate — first compute, then draw.

The WebGPU point primitive is 1 pixel. The cloud is
visible because the count is high. For sized grains use
Sprite +
`PointsNodeMaterial` (later lessons).

## Code

`instancedArray(count, "vec3")` is GPU storage. The
`element(instanceIndex)` inside `Fn` is that thread's
cell.
`renderer.compute(init)` once, `compute(update)` every
frame.
`toAttribute()` binds the storage to a vertex attribute.

No compute on the WebGL backend — a CPU array fallback
runs.

## Try this

1. Slide amplitude. The `sin(time)` multiplier grows; why
   does the Y swing increase?
2. Reset. Init compute (or CPU fill) puts positions back
   at the start. `frameCalls` can be 2 that frame.
3. HUD `points` ≈ 12000. Why are `triangles` almost 0?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
window.__egitim.backend()
```

- WebGPU: `compute.frameCalls` ≥ 1
- WebGL: 0 — no compute
- `chrome://gpu` → WebGPU: Hardware accelerated
- Don't use Spector.js; it does not capture a WebGPU
  frame

## Mini task

In init, place X/Z on a circle (`sin` / `cos` + `hash`
radius).
Keep update the same. Why is it still one compute + one
draw call?

# Lesson 44 — GPGPU

## Topic

**GPGPU** (General-Purpose computing on GPU) — using the
GPU not only to paint triangles, but for general numbers.

Old path: write position into a texture and ping-pong.
On WebGPU a **storage buffer** (`instancedArray`) does the
same job more directly.

Why? The acceleration of thousands of particles is
independent. The GPU SIMD model fits that.

In a real project: flocks, cloth, soft body, GPU particles.

## How it works

```
a = normalize(target - p) * pull / distance
v = (v + a) * friction
p = p + v
```

Three buffers:

- **position** — where
- **velocity** — where this frame
- **acceleration** — sum of forces

Euler integration: simple, cheap, blows up on a large
step.
Enough for the lesson.

The yellow sphere is the target; the cursor moves it. A
`uniform vec3` is written from JS every frame.

## Code

`ivmeler.element(instanceIndex)` is the third store.
Compute only writes numbers; `Points`/`Sprite` draws the
result.
That is why the “image shader” and the “physics shader”
are separate.

## Try this

1. Raise pull. Why does the orbit tighten, then oscillate?
2. Move the cursor fast. Is there `uniform` lag?
3. `compute.frameCalls` 1, `drawCalls` 2 (sphere +
   particles).
   Why not 5000 draw calls?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- `points` or Sprite triangles show on the HUD
- `chrome://gpu`
- Spector.js does not show the WebGPU compute buffer

## Mini task

Add a second repeller point (`uniform`). Subtract a second
direction from `a`. Do you see a bipolar field?

# Lesson 48 — Performance

## Topic

**FPS** is a result, not a diagnosis. 60 FPS ≈ the frame
must finish inside **16.67 ms**. The stall can be on the
CPU (JS, draw call) or the GPU (triangles, shader,
overdraw, memory).

Why three knobs?

- **Draw call** — the CPU says “draw this”; 180 separate
  Mesh = 180 commands. `InstancedMesh` = 1 command, 180
  copies.
- **Triangles** — segments 8 → 32 swell the geometry; the
  call can stay the same.
- **Shader** — 3 octaves of noise on every pixel;
  multiplied by overdraw.

In a real project: measure the bottleneck first, then cut.

## How it works

```
frame time = CPU + GPU + sync
16.67 ms budget (60 Hz)
high FPS + frame-ms 22 → uneven frames
```

The HUD already shows FPS, frame ms, drawCalls, triangles,
geometries, textures. This lesson plays with them.

Overdraw: painting the same pixel over and over. Additive
particles and transparent planes eat the GPU even when
draw calls are few.

## Code

The same `SphereGeometry` is shared — memory stays low,
draw calls explode on separate Mesh. The expensive
material `colorNode` is three `mx_noise_float` layers.

## Try this

1. Separate Mesh. drawCalls ≈ 180. Did FPS drop, frame-ms?
2. Instanced + high segment. Call 1, triangles flew.
3. Expensive shader. Triangles are the same, why does the
   frame slow down?

## Browser DevTools

```js
window.__egitim.info()
```

- Performance: 3 s recording, do the frame bars cross the
  16.67 ms line?
- Memory: if there is no dispose, `geometries` drop when
  you change lessons (the runner cleans up)
- `chrome://gpu`
- Spector.js does not capture a WebGPU frame

## Mini task

Separate Mesh + high segment + expensive shader. Then turn
them off one by one. Which button gave the first gain?
Why?

## Recap

1. Why can you feel hitching when FPS is 60?
2. Separate draw-call cost from triangle cost.
3. What is overdraw?

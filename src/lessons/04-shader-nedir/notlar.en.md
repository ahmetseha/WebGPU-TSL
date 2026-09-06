# Lesson 4 — What is a shader?

## Topic

A **shader** is a small program that runs on the GPU at the
same time for every vertex or every pixel. The CPU does not
paint one by one; the GPU runs **the same code** on
thousands of cores.

Why? 2 million pixels × 60 FPS. A loop in JS blows up.

In a real project materials, post-process, particles,
compute — all are shaders. This lesson does not write GLSL.
**TSL** node graphs emit WGSL (WebGPU) or GLSL (WebGL
fallback).

## How it works

```
Vertex shader   — each corner: position, UV, normal
     ↓ interpolation (varying)
Fragment shader — each pixel candidate: color
     ↓
Framebuffer
```

On a sphere UV is set at corners and **blends** inside the
triangle. `positionNode` runs in the vertex stage:
`sin(time) * normal` is a light pulse. `colorNode` makes
color from UV in the fragment stage.

Parallel because one pixel usually does not wait for
another.

## Code

`MeshBasicNodeMaterial.colorNode = vec3(uv.x, uv.y, 0.4)`
is fragment. `positionNode = positionLocal + normal * sin(time)`
is vertex. TSL compiles; you don't see WGSL.

## Try this

1. Pulse `0`. Does color change? Which stage stopped?
2. Rotate the sphere (orbit). Is UV color stuck to the
   mesh?
3. Think about fewer segments: does interpolation look
   coarser?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- No Spector.js on WebGPU — TSL → WGSL is internal
- `chrome://gpu`
- `navigator.gpu`
- Fragment cost grows with **pixel area**, not `triangles`

## Mini task

Set `colorNode` to `normalLocal * 0.5 + 0.5`. UV disappears,
direction gets color. How did vertex data reach the
fragment stage?

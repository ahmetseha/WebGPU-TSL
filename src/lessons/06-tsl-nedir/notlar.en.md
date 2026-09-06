# Lesson 6 — What is TSL?

## Topic

**TSL** (Three.js Shading Language) builds the shader as a
JS/TS node graph. You don't write string GLSL. The graph
compiles: **WGSL** on WebGPU, **GLSL** on the WebGL
fallback.

Why? One codebase, two backends. Type safety, reuse, `Fn`.

In a real project `Mesh*NodeMaterial`, post-process,
compute — all are TSL nodes.

## How it works

```
colorA, colorB, uv().x
      ↘   mix   ↙
     colorNode
         ↓
  TSL compiler
         ↓
  WGSL or GLSL
         ↓
  Pipeline (GPU)
```

`mix(A, B, t)` is a linear blend: t=0 → A, t=1 → B.
`uv().x` is 0→1 left to right. The slider adds to `t`; the
graph stays the same, only the uniform changes.

## Code

`mix(color("#1a2230"), color("#3ec5f1"), uv().x + uKay)`.
`shaderDuzlem` sets up the camera and a double-sided plane.

## Try this

1. Slider `0`. Which color is on the left? Guess, then look.
2. Shift `+0.5`. Why does the gradient run to the right?
3. If the backend were WebGL 2, would this code change?

## Browser DevTools

```js
window.__egitim.backend()
window.__egitim.info()
```

- Searching Sources for WGSL — Three compiles at runtime
- `chrome://gpu`
- `navigator.gpu`
- Spector.js only on the WebGL fallback; it does not show
  the node graph

## Mini task

Make the `mix` t `uv().y`. Why does the gradient direction
turn? Try `uv().x.mul(uv().y)` — what happens at the
corners?

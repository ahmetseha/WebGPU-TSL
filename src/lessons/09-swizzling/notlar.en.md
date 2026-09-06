# Lesson 9 — Swizzling

## Topic

**Swizzle** is picking / reordering vector channels by
letter: `.x .y .z .w` or `.r .g .b .a`. `.xy`, `.xyz`,
`.rgb` produce a sub-vector. `.yx` **swaps** channels.

Why? Flip UV, turn a normal's Y into a mask, puff 2D into
3D with `vec3(v.xy, 0)`.

In a real project, `.x` on every TSL node is a `float`
node.

## How it works

```
uv (vec2)
  .x     → horizontal 0–1  (red/gray)
  .y     → vertical 0–1
  .yx    → vec2 color: R=V, G=U  (axis swap)
positionLocal.y → mesh height, not UV
```

`.rgb` = `.xyz`. `w` / `a` is the fourth channel (opacity).
Don't read a channel that isn't there.

## Code

`vec3(uv.x)` is a broadcast. `vec3(uv.y, uv.x, 0)` =
`uv.yx` as color. `positionLocal.y * 0.5 + 0.5` maps
-1…1 → 0…1 on the plane.

## Try this

1. `uv.x` vs `uv.y`. Guess the gradient direction.
2. `uv.yx`: does red now increase upward?
3. Are `positionLocal.y` and `uv.y` the same? Look with
   orbit — one is mesh space.

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Swizzle compile error: `.z` on a `vec2`
- `chrome://gpu`
- `navigator.gpu`
- No Spector.js on WebGPU

## Mini task

Write something like `vec3(uv.xxx)` as
`vec3(uv.x, uv.x, uv.y)`. Let the third channel be V. What
are the corner colors?

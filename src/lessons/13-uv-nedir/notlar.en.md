# Lesson 13 — What is UV?

## Topic

**UV** is a 2D coordinate stuck to the mesh surface. On a
plane it is usually bottom-left `(0,0)`, top-right `(1,1)`.
A texture is printed on this paper: `texture(harita, uv)`.

Why debug `vec3(u, v, 0)`? Red = U, green = V, no blue. A
broken unwrap shows up immediately.

In a real project every `Plane` / `Box` / `glTF` carries
UV. In the shader `uv()` is default channel 0.

## How it works

```
Geometry attribute: uv
  vertex shader → vary
  fragment: uv()  (0–1, interpolation inside the triangle)
  texture(sample) or procedural (this course)
```

U is horizontal, V is vertical. On a Three plane V is often
bottom→top 0→1. Texture wrap: outside 0–1 is `Repeat` /
`Clamp`.

## Code

`colorNode = vec3(uv().x, uv().y, 0)`. “U only” is a gray
ramp — one channel. No texture yet; the link: the same
`uv()` will be the sample point.

## Try this

1. What color is bottom-left? Is `(0,0,0)` black? Guess.
2. Top-right should be yellow (`1,1,0`). Look with orbit.
3. If there were a texture, which texel would land on that
   same corner?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- HUD `textures` is still 0 — procedural
- `chrome://gpu`
- `navigator.gpu`
- UV attribute is a CPU buffer; interpolation is in the
  fragment

## Mini task

Write `vec3(uv().x, 0, uv().y)`. Green disappears, blue
becomes V. Bind a texture to this UV later (upcoming
lesson).

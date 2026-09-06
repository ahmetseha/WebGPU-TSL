# Lesson 14 — UV manipulation

## Topic

**Scale, offset, rotate, run UV through time** — a texture
or pattern moves without breaking the mesh geometry.

Why? Water, scrolling stripes, tiles, radar. Geometry stays
the same; the sample point changes.

In a real project atlas offset, triplanar, scroll — all
are these four operations.

## How it works

```
uv
  + (time * speed, 0)     scroll
  + (offsetX, offsetY)
  - 0.5
  * scale
  * rot(cos, sin)         rotate around the center
  + 0.5
  → checker floor(uv*8)
```

Rotation is around the center: subtract 0.5 first, rotate
in 2D, put it back. Scale grows from the center. Scroll is
on the U axis.

## Code

`q = (uv + scroll + offset - 0.5) * scale`.
`vec2(q.x*c - q.y*s, q.x*s + q.y*c) + 0.5`. The checker
`mod(floor.x+floor.y, 2)` makes the rotation visible.

## Try this

1. Scroll `0`. The checkers freeze. Guess, then turn it on.
2. Scale `0.2` vs `8`. Why “zoom”?
3. Rotation π/2. Checkers are 90°, not 45° — why a square
   grid?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Five uniforms, one draw
- `chrome://gpu`
- `navigator.gpu`
- FPS should not drop with scroll — same fragment cost

## Mini task

Make scroll `vec2(time, time)` (diagonal). Same as offset
Y? If not, why does `time` rise every frame while offset
stays fixed?

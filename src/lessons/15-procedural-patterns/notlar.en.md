# Lesson 15 — Procedural patterns

## Topic

A **procedural pattern** is `uv` math with no texture file:
gradient, stripe, checker, circle, ring, grid, wave,
radial.

Why? Infinite resolution, 0 texture memory, animation by
parameter.

In a real project UI, masks, toon shadow, ground tiles,
VFX.

## How it works

```
gradient  mix(A,B,u)
stripe    step(0.5, fract(u*10))
checker   (floor(u*8).x + .y) % 2
circle    1 - dist(uv, 0.5)*2
ring      1 - |dist - r| * k
grid      thin edge of a fract cell
wave      sin(u*30 + v*8)
radial    dist outward from the center
```

All on the same plane, same draw. The button picks `uMod`.

## Code

The critical ones: `fract` repeats, `floor` is the cell
index, `distance` is radius, `abs` is ring thickness,
`step` is the threshold. Color is `mix(ground, cyan, mask)`.

## Try this

1. Stripe: put `2` in your head instead of `10`. How many
   bands?
2. Checker vs grid. One is filled squares, one is lines —
   which function is the difference?
3. Ring: radius `0.35`. Why is the center dark?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `textures: 0` should stay
- `chrome://gpu`
- `navigator.gpu`
- Eight patterns in one fragment program — cost is almost
  fixed

## Mini task

Multiply `checker` by `circle`. You get a checkered disk.
Write a second `Fn` without adding a texture.

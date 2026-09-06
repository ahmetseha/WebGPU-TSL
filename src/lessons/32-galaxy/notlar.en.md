# Lesson 32 — Galaxy

## Topic

A galaxy is not randomly scattered points. **Radius**,
**arm count**, and **twist** (spin) produce a spiral.

Why? Procedural distribution wants no texture/model. The
same formula becomes a star field, magic, a portal ring.

In a real project: menu background, space scene, VFX disk.

## How it works

```
u = hash(i)          → 0..1
r = u * u * R        → denser at the center (radial)
arm = floor(u * N)
angle = arm * (2π/N) + r * twist + jitter
x = cos(angle) * r
z = sin(angle) * r
color = mix(warm, cool, r)
```

`r * r` piles toward the center. `r * twist` rotates the
outer ring —
that is the spiral itself. Jitter thickens the arm.

Inner color is warm (core), outer is cool (disk).
`sizeNode` varies slightly with hash.

## Code

`kolSayisi`, `burgu`, `boyut` are **uniforms**. The slider
only writes a JS number; geometry is not rebuilt. Position
is entirely `positionNode` + `instanceIndex`.

## Try this

1. Arms 2 → 8. Why do arms multiply, is the point count
   the same?
2. Twist 0. Why does it become a barred galaxy?
3. Try writing `r` instead of `r * r` (guess before the
   mini task: the center thins out).

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `drawCalls` ≈ 1, `points` = 9000
- Changing a uniform does not raise the draw call
- `chrome://gpu`

## Mini task

Add time: `angle + time * 0.05`. Let the disk turn slowly.
Make the spin speed a separate uniform.

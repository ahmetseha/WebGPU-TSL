# Lesson 33 — Explosion

## Topic

Explosion: every particle flees the center in the **opposite
direction**.
Direction is random, length is **age × speed**.

Why GPU? Normalizing 6000 directions in JS is not cheap;
in TSL `normalize(hash vector)` is free per point.

In a real project: sparks, hit burst, magic scatter.

## How it works

```
direction = normalize(hash.xyz * 2 - 1)
position = direction * age * speed
opacity = 1 - age
```

`hash` produces 0..1. `* 2 - 1` → -1..1 cube.
`normalize` spreads the cube onto a sphere surface — the
burst becomes homogeneous.

Age is a CPU `uniform`. **Explode** resets age. Every frame
the GPU solves the same formula with the new age. No array
upload.

## Code

`opacityNode = yaş.oneMinus()`. `AdditiveBlending` brightens
overlapping points. `depthWrite = false` hides the sorting
error.

## Try this

1. Speed slider. Why does it fade early / fade late?
2. Drop `normalize`. Why do the cube corners stay full?
3. Age locks at 2.4. Why do the particles stop?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `compute.frameCalls` 0 — this is a render shader, not
  compute
- `points` = 6000, `drawCalls` ≈ 1
- Performance: clicking Explode should not raise JS cost

## Mini task

Make age `fract(time * speed + hash)`. Continuous looping
micro explosions. Then reset in sync again with **Explode**.

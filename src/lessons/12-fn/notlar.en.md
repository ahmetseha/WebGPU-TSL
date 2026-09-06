# Lesson 12 — Fn

## Topic

`Fn` is a reusable TSL function. It looks like a JS
function; in the compiler it becomes a **shader function /
sub-graph**. You give a name instead of copy-pasting a node
chain.

Why? Circles, waves, noise masks live in more than one
material.

In a real project `mx_noise_float`, toon, dissolve — all
are `Fn` packs. This lesson mixes three of them.

## How it works

```
createCircle()      → 1 - dist(uv, 0.5)
createWave()        → sin(uv.y + time)
createNoiseMask()   → mx_noise_float(uv*5 + t)
        ↘     ↙
   circle * noise → mask
        mix(ground, cyan, mask)
        + yellow * wave
```

`Fn(() => { ... })` then **call** with `createCircle()`.
If you don't call it, TSL warns.

## Code

Three `Fn`s. `maske = createCircle() * mix(1, noise, uGurultu)`.
`mix` ground/cyan + `createWave()` yellow contribution.
Sliders are only uniforms; the `Fn` body stays the same.

## Try this

1. Why isn't the circle edge soft — is `saturate` cutting
   it? Guess.
2. The wave is a horizontal band — because of `uv.y`. What
   if it were `uv.x`?
3. Noise slides over time. Which `Fn` uses `time`?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- One plane, one draw — three Fn in one fragment
- `chrome://gpu`
- `navigator.gpu`
- Not compute; `mx_noise` is in the fragment

## Mini task

Give `createCircle` a center parameter (`Fn(([m]) => ...)`).
Call two circles, combine with `max`. Why did `Fn` become
required?

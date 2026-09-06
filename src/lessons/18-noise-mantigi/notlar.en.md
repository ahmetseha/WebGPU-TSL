# Lesson 18 — How noise works

## Topic

**Noise** — a field that looks random but keeps neighboring
pixels consistent. Speckled `hash` and soft Perlin are not
the same thing.

Why use it? Nature has no sharp grid. Cloud, terrain, rust,
marble want “controlled random”.

In a real project terrain, dissolve, wind, and procedural
UV all lean on noise. No proof; tell them apart with your
eye.

## How it works

```
hash(seed)          each pixel independent 0..1    → TV snow
value noise         cell corners random, in-between softens
gradient / Perlin   a direction (gradient) in the cell, more natural veins
```

`hash(uv)` wants a float seed. `uv.x * 900 + uv.y * 470`
makes the neighbor pixel a different seed. Result is
**white noise**: a nearby pixel has no idea.

`mx_noise_float` is MaterialX Perlin (gradient noise).
Scale 4: big blotches, readable like value-noise. Scale 20:
thin veins, “Perlin detail”.

## Code

`mx_noise_float(uv * ölçek, 0.5, 0.5)` → `n * 0.5 + 0.5`.
Perlin produces roughly `-1..1`; on screen it is pulled to
`0..1` gray.

Buttons write the `mod` and `olcek` uniforms. Walk the
scale yourself with the slider too.

## Try this

1. **hash random**. Zoom in. Why doesn't a “cloud” form?
2. Scale 4 → 20. Why do the blotches shrink? Did the
   function change, or the frequency?
3. Scale `1`. Why almost flat gray? Is the gradient
   changing very slowly?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — no bitmap. Noise is born in the
  fragment.
- `drawCalls` — one plane. Three buttons do not add a new
  mesh.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Put `floor(uv * 8)` into the `hash` seed. You will see
square-by-square random cells. Why is this like value
noise's “corner randomness”, with no smoothing yet?

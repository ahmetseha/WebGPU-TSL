# Lesson 53 — Final project

## Topic

One mood: **a snowy hill at dusk, a quiet camp**.

Together (not a dump):

- Procedural terrain (the same function for placement)
- Instanced pine / rock
- Cabin + chimney smoke
- Fresnel shield sphere
- Snow (WebGPU compute, otherwise CPU)
- Bloom + vignette
- Flickering window light
- HUD already shows FPS / draw / compute

Why this scene? What you learned in one place: TSL
material, instance, compute, post, light, fog.

## How it works

```
araziY → vertex + tree/rock matrix
compute snow: fall, wind, avoid camera, birth on ground hit
compute smoke: rise, rebirth at the ceiling
fresnel = 1 - |N · V|
pass(scene) → bloom → vignette → RenderPipeline.render
```

Few draw calls: 1 terrain, 2 pine instances, 1 rock, a few
cabin meshes, 1 shield, 2 particles. Compute is a separate
counter.

## Code

If there is a `RenderPipeline` you supply `render()`; the
runner does not call `renderer.render`. Compute is inside
`update`, the pipeline is inside `render`.

Bloom threshold 0.74 — snow should not bloom, window/shield
should.

## Try this

1. Turn bloom off. Why does the camp look “colder”?
2. Wind. Do snow and smoke share the same `uniform`?
3. HUD: `compute.frameCalls` is 2 on WebGPU (snow+smoke).

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
window.__egitim.backend()
```

- Performance: the 16.67 ms line
- `chrome://gpu`
- Spector.js does not capture WebGPU
- Memory: when you change lessons the runner cleans the
  scene

## Mini task

Add a very light `mx_noise_float(time)` to the shield. Let
the shield “breathe” without breaking the camp's quiet.

## Recap

1. Why 50 trees, not 50 Mesh?
2. Difference between compute and a vertex shader?
3. FPS is not enough; what else do you read?

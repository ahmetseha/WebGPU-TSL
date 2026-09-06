# Lesson 43 — GPU particle simulation

## Topic

A particle carries **position + velocity**. Every frame:

`velocity += force` then `position += velocity`.

Why compute? The same Euler step 4000–8000 times; the GPU
does it in one dispatch. The CPU fallback is the same
formula, one core.

In a real project: smoke, sparks, flock, snow.

## How it works

```
init compute (once)
  position ~ hash(instanceIndex)
  velocity ~ small random

every frame compute
  v += light sin force
  v *= friction
  p += v

draw
  Sprite.count = count
  positionNode = positions.toAttribute()
```

The count slider rebuilds the buffer. `instancedArray`
size is fixed — growing it means a new store.

On WebGPU a sized grain = `Sprite` + `PointsNodeMaterial`.
The `Points` primitive stays 1 px.

## Code

Two `instancedArray`s: `vec3` position, `vec3` velocity.
The friction `uniform` changes from JS; the GPU reads it
every frame.
HUD `compute.frameCalls` should be 1 (init is on a
separate frame).

## Try this

1. Count 500 → 8000. How do FPS and `points` change?
2. Friction 0.90. Why does velocity die fast?
3. On WebGL `compute.frameCalls` stays 0. Why is the
   simulation still visible?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- When count changes, `memory` moves a bit (new buffer)
- `chrome://gpu` — WebGPU line
- No Spector.js; it does not see WebGPU compute

## Mini task

When they hit the ground (`p.y < 0`) flip velocity Y.
Branch with `step` / `mix` (`If` is not required in TSL).
Is the bounce visible?

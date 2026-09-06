# Lesson 47 — Snow

## Topic

Snow is lesson 45's physics tied to a “place”: random
birth, fall speed, wind, spin, size, avoiding the camera,
respawning above when it hits the ground.

Why compute? Thousands of independent grains. The CPU
fallback is the same loop — on WebGL `compute.frameCalls`
stays 0.

In a real project: winter scene, ash, dust, leaves.

## How it works

```
p += v
p.x += wind
p.z += sin(time + hash)     // sway
if near camera p += normalize(p - cam) * avoid
if y < ground p = new birth (high up)
```

Spin and size are on the **draw** side: `rotationNode`,
`sizeNode`. Compute only moves the point.

Don't use WebGPU 1 px `Points` — `Sprite` +
`SpriteNodeMaterial` makes the grain visible.

## Code

A camera `uniform` is written from JS every frame. Recycle
is `step(p.y, 0.06)` + `mix`. Hash + time gives a new XZ;
the same index is reused, the buffer does not grow.

## Try this

1. Pull wind to the end. Why does snow go sideways “like
   rain”?
2. Push the camera into the grains. Is there scatter?
3. Count is fixed 3500. `drawCalls` 2 (ground + snow).
   Why?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- WebGPU: 1 compute every frame
- `chrome://gpu`
- Spector.js does not capture the snow compute

## Mini task

Shrink the birth box (8 → 4). Why does snow pile up like
a “curtain” in front of the camera?

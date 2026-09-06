# Lesson 37 — TSL Post-processing

## Topic

Once the scene is a texture you play in **screen space**
with fragment TSL. You don't touch model vertices.

Why? The same bloom/vignette is cheaper than writing a
separate material on every object. One quad, one shader.

In a real project: lut, chromatic aberration, film grain.

## How it works

```
scenePass.getTextureNode()  → RGB(A) screen
uv()                        → 0..1 screen
texture(doku, uv + offset)  → neighbor pixel
```

- **Grayscale** — luminance 0.299/0.587/0.114
- **Tint** — channel multiply
- **RGB shift** — three separate R/G/B UV samples
- **Vignette** — distance from the center
- **Noise** — `mx_noise_float(uv * scale + time)`
- **Scanline** — `sin(uv.y * N)`

All of them are `outputNode`. `needsUpdate = true` is
required; otherwise the old graph stays.

## Code

Buttons change the effect on the same `pass`. The runner
only calls `pipeline.render()`.

## Try this

1. RGB shift `k` 0.01 → 0.05. Why do the edges split?
2. Noise scale 380 → 40. Why does it turn from “speckle”
   to “blotch”?
3. Scanline 880 → 80. Why do the TV lines thicken?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- Changing the effect should not jump `drawCalls`
- `textures` as many as the pass target
- Console: if there is a shader error, TSL compile is
  there

## Mini task

Make RGB shift amount a uniform + slider. The three sample
UVs should use the same `kayma` value.

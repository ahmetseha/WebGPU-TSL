# Lesson 17 — Texture distortion

## Topic

**Texture distortion** — you bend the UV you read with, not
the texture. Water, heat haze, a printed flag are the same
idea: `texture(map, uv + offset)`.

Why use it? You don't redraw the bitmap every frame. The
GPU only shifts the address.

In a real project water surfaces, distortion behind glass,
heat haze, and magic portals use this technique.

## How it works

```
uv
  → sin(uv.y * freq + time) * amp     horizontal wave
  → + mx_noise_float(uv + time) * n   irregular jitter
  → texture(map, bozukUv)
```

The texture stays the same. If the red circle “melts”, the
texel did not change; the pixel is reading another UV.

`sin` gives regular water / flag. `mx_noise_float` adds
heat and liquid noise. Adding both looks natural.

## Code

`shaderDuzlem` is a fullscreen plane. Sliders are
`uniform`: JavaScript writes `freq.value`, the GPU computes
a new offset in every fragment.

`vec2(dalga + noise, 0)` only shifts X. If you add to Y as
well, the lens / heat feel grows.

## Try this

1. Amplitude `0`. Why is the circle round again? Did the
   offset become zero?
2. Frequency `4` → `20`. Waves get denser. Did texture
   resolution change?
3. Noise `0` → `0.3`. Does the sine wave stop, or stack on
   top?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — CanvasTexture is still 1 (plus
  output). Distortion does not produce a new texture.
- `triangles` — one plane. UV math does not add a draw
  call.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Make the offset `vec2(0, dalga)`. The wave becomes
vertical. Why does the circle stretch up-down, not
left-right?

# Lesson 16 — Texture sampling

## Topic

**Texture sampling** — the GPU reading a bitmap at a UV
coordinate. `texture(map, uv())` returns that pixel's
`vec4` color (RGBA).

Why use it? A procedural pattern cannot produce everything.
Logo, photo, roughness, mask come from a file (or a
canvas).

In a real project albedo, opacity mask, UI atlas, and video
textures are read by sampling.

## How it works

```
CPU: CanvasTexture (pixel buffer)
  → GPU texture
Fragment
  → uv()  (0..1)
  → texture(map, uv)
  → colorNode / opacityNode
```

- **UV** — the surface's 2D address. `(0,0)` bottom left,
  `(1,1)` top right (Three.js).
- **Sampling** — reading the texel at that address.
- **Alpha** — the `.a` channel of a `vec4`. Can be
  transparency or a mask.
- **Mask** — turning one channel into `opacityNode`. Opens
  a black hole.

This lesson does not download a file. `CanvasTexture`
produces a checker + red circle + low alpha on the right
half.

## Code

`texture(doku, uv().mul(tekrar))` scales UV to show repeat
with `RepeatWrapping`.

- **Color** — `ornek.rgb`
- **Alpha** — write `ornek.a` as gray. See the channel.
- **Mask** — color stays, `opacityNode = ornek.a`. The
  stripes behind show through the hole.

## Try this

1. Repeat `1` → `4`. Why do the squares shrink? Did the
   texture change, or UV?
2. **Alpha**. Why is the right half a darker gray? What did
   `globalAlpha` do on the canvas?
3. **Mask**. Why are the ground stripes visible only on the
   right and outside the circle?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — CanvasTexture + renderer output. Not
  0.
- `drawCalls` — ground plane + sample plane + output pass.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Make UV `uv().add(vec2(0.25, 0))`. Why does the circle
slide sideways? With `RepeatWrapping`, what comes in from
the left edge?

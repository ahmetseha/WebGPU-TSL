# Lesson 27 — Animated noise

## Topic

Still noise is a photograph. `noise(uv + time)` **slides**
the same field or walks it on a 3rd axis. Smoke, water,
energy, lava are palettes of the same engine.

Why use it? Endless, seamless motion instead of a video
texture loop.

In a real project fog card, lava lamp, shield energy, water
normal (later).

## How it works

```
uv' = uv + (0, -time * speed)     scroll up (smoke/water)
n    = mx_noise_float(uv' * scale)
n3   = mx_noise_vec3(uv, time)  domain warp / energy vein
```

- **Smoke** — gray n, UV up.
- **Water** — two octaves, blue-cyan `smoothstep`.
- **Energy** — `mx_noise_vec3` channels, bright veins.
- **Lava** — dark base + orange + yellow hot threshold.

Speed 0 = paused procedural. Scale = zoom, not speed.

## Code

`shaderDuzlem` — fullscreen plane only. The button is the
`mod` uniform.

`n.add(n2 * 0.35)` is coarse FBM (two layers). Real fBm
wants more octaves; enough for the eye.

## Try this

1. Speed `0`. Why does the pattern become a photo? Did the
   `time` multiplier die?
2. Scale `2` → `10`. Why does the motion look “more
   nervous”? Same speed, denser peaks.
3. **Energy** vs **Lava**. Same `n` family, why is one
   veins and one magma? Palette + threshold.

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- No bitmap. `memory.textures` may still not be 0 because
  of the output pass.
- `mx_noise_vec3` makes the fragment heavier. Performance →
  ~16.7 ms frame target.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add domain warp to water with `uv + vec2(n * 0.08, 0)`.
Why do the waves wrinkle instead of sliding flat?

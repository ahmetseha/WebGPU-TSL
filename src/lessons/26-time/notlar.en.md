# Lesson 26 — Time

## Topic

**time** — TSL's flowing uniform in seconds. You don't need
to write JavaScript `Date.now`; Three.js stamps
`frame.time` every frame.

`sin(time)` produces a soft `-1..1` period. Scale, color,
and position all feed from the same t.

Why use it? Procedural animation stays in sync. Pause =
`speed = 0`.

In a real project pulse UI, idle bounce, neon flicker,
shader-based walk.

## How it works

```
t = time * speed
sin(t) ∈ [-1, 1]
scale:     p' = p * (1 + 0.22*sin)
color:     mix(blue, yellow, sin*0.5+0.5)
position:  p' = p + (0, 0.45*sin, 0)
```

Three meshes, three readings. The same clock. Speed 0:
frozen frame. Speed 4: 4×.

`positionNode` does scale in the vertex stage. We don't
set `mesh.scale` — the world matrix on the HUD stays 1,
the shape still breathes.

## Code

`uniform(1)` is speed. Slider is `hiz.value`. `time` is
already on the GPU.

The middle box only changes `colorNode`; draw and triangle
stay fixed.

## Try this

1. Speed `0`. Why do all three freeze at once? Shared `t`?
2. Speed `3`. Why are the color cycle and the bounce in
   phase? Same `sin(t)`?
3. Watch the right ring. `mesh.position.y` stays 0 in JS.
   Where is the motion?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 3 meshes + output. Animation is not an
  extra call.
- FPS / frame ms: when speed rises **shader cost should
  stay the same**. No CPU loop.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Give the color box `sin(t * 2)`. Why does it blink 2×
faster while the bounce stays the same? What is the point
of splitting two frequencies on purpose?

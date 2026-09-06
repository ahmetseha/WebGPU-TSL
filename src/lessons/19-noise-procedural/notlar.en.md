# Lesson 19 — Procedural shaders with noise

## Topic

The same `mx_noise_float` goes into four looks: height-colored
**terrain**, thresholded **cloud**, gray **smoke**,
threshold **dissolve**.

Why use it? One function instead of four bitmaps. Changing
threshold and color palette is not a new asset.

In a real project planet mask, magic vanish, fog card, and
stylized terrain are all this palette+threshold pattern.

## How it works

```
n = noise(uv * 6 + (0, -time))     0..1
terrain   n as green → sand → snow
cloud     white if n > 0.42
smoke     write n as gray, UV scrolls up
dissolve  step(threshold, n)  opens a hole
```

`smoothstep` is a soft band. `step` is a razor cut — the
dissolve “burned edge” feel comes from here.

`opacityNode = erime` is active only in dissolve mode.
Scene color shows through the hole.

## Code

Plane and sphere **share the same material**. UV pinches
at the sphere poles; noise stretches there. That is not a
bug, it is spherical UV reality.

The threshold slider only matters in dissolve, but the
graph always produces `n`. The unused branch stays cheap
on the GPU; one graph is still enough for teaching.

## Try this

1. **Terrain** → **Cloud**. Why does the same `n` read
   differently? Did the color map change?
2. Dissolve threshold `0.2` → `0.8`. Why is the mesh
   “eaten”? Which side does `step` drop?
3. **Sphere / plane**. Why does the pattern stretch at the
   poles? Does UV break there?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — visible mesh + output. Drops when you hide
  the second shape.
- `triangles` — a 48×32 sphere is far more than a plane.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

In dissolve add a fire ring at the edge with
`mix(color, red, smoothstep(threshold, threshold+0.05, n))`.
Why does the threshold slide both the hole and the ring
together?

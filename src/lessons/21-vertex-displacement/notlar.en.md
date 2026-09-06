# Lesson 21 — Vertex displacement

## Topic

**Vertex displacement** — moving every vertex every frame
with TSL. `sin` + `time` is wave/flag, `mx_noise_float` is
terrain, `normalLocal * sin` is jelly.

Why use it? Writing the animation on the CPU with
`geometry.attributes.position` is expensive on an 80×80
plane. The GPU already processes those vertices.

In a real project flags, sea, jello, procedural planet
crust.

## How it works

```
high-segment geometry
  → positionLocal
  → wave:    z += sin(x*freq + time)*amp
  → flag:    same, * (x+1)/2   free edge swings more
  → terrain: z += noise(x, y, time)
  → jelly:   p += normal * sin(time + |p|)
  → light (old normal — still rough)
```

Few segments = angular wave. 80×80 is intentional. On the
jelly sphere: radial breath.

`Fn(() => sin(...))` shares the same wave expression with
the flag. You don't copy the graph, you reuse it.

## Code

The plane sits in XY, offset goes to Z (toward the camera).
Jelly is a separate sphere + `normalLocal`.

`MeshStandardNodeMaterial` + `temelIsik`: position moves,
shadow sometimes “slides”. Normal update is the next
lesson.

## Try this

1. Frequency `2` → `8`. Waves get denser. If segments are
   not enough, why does it break like stairs?
2. **Flag**. Why does the left edge almost stop? Is
   `(x+1)/2` ~0 there?
3. **Jelly**. Why does the light slide like a “wet balloon”?
   The normal was not updated.

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `triangles` — 80×80 plane ≈ 12800 triangles + output.
  Jelly sphere is a separate count.
- `drawCalls` — one visible mesh. We don't open both at
  once.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add a small Z jitter to the flag with `mx_noise_float`.
Why does “cloth” stay too regular with only `sin`?

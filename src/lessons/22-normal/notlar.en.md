# Lesson 22 — Normal

## Topic

A **normal** is the unit vector pointing “out” of a
surface. Light finds brightness with `dot(N, L)`.

When you move a vertex with `positionNode`, the normal in
the buffer stays on the **old surface**. The silhouette
is wavy, the specular still looks like a smooth sphere —
light is lying.

Why does it matter? If you don't update normals after
displacement you get wet / broken shadows.

In a real project ocean, tessellation, normal maps, and
baked normals all carry this vector.

## How it works

```
left:   p' = p + N * sin(x*f+t)*amp     no normalNode
        lighting ← geometry normal (sphere)
right:  same p'                         normalNode ≈ Nview + (cos*amp*f, 0, 0)
```

Analytic idea: if height is `h = amp*sin(freq*x+t)` then
`dh/dx = amp*freq*cos(...)`. Adding that slope to the
normal is a first-order approximation. Not perfect; the
left/right difference teaches.

`normalView` color = see the vector as RGB. The left
sphere stays like “flat paint”; on the right, wave lines
walk.

## Code

Two `MeshStandardNodeMaterial`s, the same `pos`, one
directional + ambient. Left is reddish (broken), right is
greenish (approximate).

Set amplitude 0: both are identical spheres. The problem
is born from displacement.

## Try this

1. Orbit around the light. Why is the left a “plastic egg”,
   the right grooved?
2. **normalView color**. Why is the left a calm gradient,
   the right striped?
3. Amplitude `0`. Why does the difference end? Did the
   normal get fixed, or did the displacement disappear?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 2 spheres + output. Normal fix is not an
  extra draw.
- `triangles` — two high-segment spheres.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Turn off `normalNode` on the right sphere (comment it).
Why does the light immediately look like the left? Verify
the sentence “shape right, shadow wrong” with your own
eye.

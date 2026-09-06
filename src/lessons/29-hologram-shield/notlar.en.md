# Lesson 29 — Hologram shield

## Topic

An energy shield is the product of four ideas: **Fresnel**
(edge), **animated noise** (blotch), **opacity** (glass),
**emissive** (its own glow) + a scan line.

The **intersection feel** is not a fake depth test:
`fresnel * noise`. The edge is already bright; noise burns
holes in it. The eye reads “collision on the surface”.

Why use it? Sci-fi shield, force field, holo-sphere — a
plain sphere is enough as geometry.

## How it works

```
V = normalize(camera - worldPos)
F = pow(1 - |N·V|, power)
n = noise(positionLocal * scale + (0, time, 0))
scan = thin horizontal line (fract(uv.y*42 - time))
alpha = (F * (n+0.28) + scan*0.12) * density
emissive = cyan * (F*n + scan)
```

A small icosahedron inside: the thing the shield
“protects”. `depthWrite false` does not erase the core.

`positionLocal` noise rotates with the object when the
world turns. UV noise sticks to the shell; the two feel
different.

## Code

One `MeshStandardNodeMaterial` shell. Sliders keep the
graph live, no material rebuild.

The core rotates slowly in JS; the shield flickers in TSL.
Two clocks, split on purpose.

## Try this

1. Fresnel power `5`. Why does the shield collapse into a
   thin ring? Is the middle `F≈0`?
2. Noise scale `1` → `7`. Blotches get denser. Why is the
   intersection more “sparkly”?
3. Density `0`. The core remains. Does the shield leave
   the draw call, or is it an alpha 0 mesh?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- Even at density 0, `drawCalls` does not drop: the mesh
  is visible, alpha 0. `visible = false` cuts the call.
- `triangles` — 64×48 shell + icosahedron.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add a weak Fresnel rim to the inner object too. Why do the
shield and core edges read as a “double ring”? Which one
do you keep emissive, which one albedo?

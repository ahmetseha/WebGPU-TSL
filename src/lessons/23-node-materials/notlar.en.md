# Lesson 23 — Node materials

## Topic

Three siblings, the same `colorNode`:

- **MeshBasicNodeMaterial** — unlit. Light is ignored. UI,
  debug, emissive poster.
- **MeshStandardNodeMaterial** — metal/roughness PBR.
  Everyday 3D object.
- **MeshPhysicalNodeMaterial** — Standard + clearcoat,
  transmission, sheen…

Why use them? “The same TSL color” lives differently per
lighting model. Wrong class: either flat paint or
unnecessarily expensive glass.

In a real project product shot is Physical (clearcoat),
character is Standard, HUD is Basic.

## How it works

```
same albedo
  Basic     → fragment = colorNode
  Standard  → BRDF(N, L, V, roughness, metalness)
  Physical  → BRDF + clearcoat layer
```

Turn the light off: Standard and Physical go dark (a bit
remains if ambient stays), Basic stays the same. That is
the unlit definition.

Clearcoat: a second specular like car polish. The right
sphere is more “wet glass”.

## Code

Three meshes share the **same** `SphereGeometry` instance.
Draw call is still 3 — sharing geometry does not merge
draws, it only saves RAM.

`clearcoat` goes in via a `Record<string, unknown>`
constructor; the field is missing from the type file,
`setValues` writes it at runtime.

## Try this

1. Turn **Light on** off. Which one keeps its color? Why?
2. Orbit. Why is the highlight sharper on Physical than
   Standard?
3. `renderer.info.memory.geometries` — 1 or 3? Does
   sharing show on the HUD?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 3 spheres + output. Material type does not
  change the call count.
- `memory.geometries` — shared geo. Don't be surprised if
  you expected 3; 1 can be correct.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Set the middle Standard's `metalness` to `0.9`, `roughness`
to `0.1`. Why does it become almost a mirror, and why does
Basic never?

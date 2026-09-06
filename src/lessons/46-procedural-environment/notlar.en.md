# Lesson 46 — Procedural environment

## Topic

A **procedural environment** — producing a world with a
function instead of stacking textures/models. This lesson
is a small hill: terrain, grass, rock, sky color, fog,
wind.

Why? A consistent sense of place, not an effects dump. The
same height function goes to both vertices and instance
placement; grass does not hang in the air.

In a real project: stylized world, prototype level,
background.

## How it works

```
araziY(x, z) = sin(x) * cos(z)
Plane (XY) → rotateX(-90°) → world XZ
displacement local Z = araziY  → world Y
```

Grass / rock: `InstancedMesh` + `setMatrixAt`.
Wind: `sin(time + world.x)` only at the blade tip
(`positionLocal.y + 0.2`). The root stays put.

Fog (`Fog`) melts far grass into the sky — depth is cheap.

## Code

One `uniform` for wind. Grass color is `hash(instanceIndex)`.
One tree (cylinder + cone) gives the scene a “place”; not
500 trees.
HUD: 1 terrain + 1 grass + 1 rock + 2 meshes ≈ few draw
calls.

## Try this

1. Set wind to 0. Why does the world become a “postcard”?
2. `CIME` 520 → 80. Do drawCalls change? triangles?
3. Tighten the fog far. Why does the horizon get sharp?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().render.drawCalls
window.__egitim.info().render.triangles
```

- `compute.frameCalls` 0 — this lesson is not compute
- `chrome://gpu`
- No Spector.js on WebGPU

## Mini task

Don't add a second tree type. Make the same cone scale an
`InstancedMesh` (12 of them). Why does the draw call rise
by 1, not 12?

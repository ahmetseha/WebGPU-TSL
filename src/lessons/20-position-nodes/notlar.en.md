# Lesson 20 — Position nodes

## Topic

**positionLocal** — the vertex position in the geometry's
own space. `positionNode` changes that on the GPU.
In JavaScript `mesh.position` moves the world; TSL bends
every **vertex**.

Why use it? Wave, breath, swell, terrain — writing
thousands of vertices on the CPU is slow.

In a real project ocean, cloth, blob, and stylized
characters live with TSL `positionNode`.

## How it works

```
Geometry buffer (once on the CPU)
  → each vertex: positionLocal
  → positionNode = positionLocal + (0, sin(x)*offset, 0)
  → model / view / clip
  → triangle
```

Offset `0` = original sphere. As offset grows, X-based sin
is added to Y. Without 64×48 segments the wave “breaks”:
no vertex, no move.

Color debug is `positionLocal * 0.5 + 0.5` — you see XYZ
as RGB. Even if the shape deforms, the color is the
**original** local; debug reads before deformation.

## Code

`MeshStandardNodeMaterial` + `temelIsik`: after the move,
light still computes with the old **normal**. Broken
shadow is Lesson 22's topic.

`SphereGeometry(1, 64, 48)` is intentionally dense. The
same shader with few segments becomes a “low poly wave”.

## Try this

1. Offset `0` (positionLocal). Why doesn't HUD `triangles`
   change? Vertex count, or position?
2. Offset `0.4`. Why does the silhouette squash like an
   ellipse? Which axis is going with sin?
3. **positionLocal color**. Which axis is red/green/blue?
   Why does deformation color stay in place?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `triangles` — high segment. Offset does not add a draw
  call.
- `drawCalls` — 1 mesh + no light (light is not a draw) +
  output.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add the offset along `normalLocal * sin(x)`. What is the
difference between a swelling sphere and a Y-only wave?
Why does the normal push “outward”?

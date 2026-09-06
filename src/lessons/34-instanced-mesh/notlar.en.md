# Lesson 34 — InstancedMesh

## Topic

**Instancing** — drawing the same geometry and material N
times, with N matrices, in **one draw call**.

Why are 2000 separate `Mesh`es a disaster? Each mesh ≈ 1
draw call.
The CPU binds state on every call. Even if 2000 boxes are
simple, the CPU chokes. `InstancedMesh` tells the GPU
“this box 2000 times, with these matrices”.

In a real project: forest, city windows, asteroids, crowd.

## How it works

```
1 BoxGeometry + 1 Material
  → InstancedMesh.count = N
  → setMatrixAt(i, Matrix4)
GPU: 1 draw, instanceIndex 0..N-1
```

`compose(position, quaternion, scale)` produces a 4×4
matrix.
`instanceMatrix.needsUpdate = true` uploads the buffer.

HUD: in instance mode `drawCalls` stays small.
When you open **2000 separate Mesh**, `drawCalls` climbs
to N.

## Code

`new InstancedMesh(geo, mat, 2000)` reserves the max slots.
The slider only cuts `.count` — the buffer is not rebuilt.
Separate mode opens a new `Mesh` + new material for every
box.

## Try this

1. Count 50 → 2000, instance mode. Does `drawCalls` change?
2. Open **2000 separate Mesh**. FPS and `drawCalls`?
3. Lower the count in separate mode. Why does it still
   feel expensive?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `render.drawCalls` — instance ≈ 1, separate ≈ count
- `render.triangles` — can be similar in both modes
- Performance: CPU bound is in the separate meshes, not
  GPU triangles

## Mini task

With `setColorAt(i, color)` make boxes near the center
blue, edge ones orange. `instanceColor.needsUpdate`.

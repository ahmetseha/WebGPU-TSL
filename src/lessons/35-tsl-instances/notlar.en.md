# Lesson 35 — TSL + Instances

## Topic

`setMatrixAt` gives the base pose. **TSL** additionally
wiggles and paints each instance on the GPU.

Why? Writing the Y of 1600 boxes every frame with
`setMatrixAt` in JS means upload. `sin(time + instanceIndex)`
stays in the shader.

In a real project: grass in the wind, a breathing crowd,
idle bob.

## How it works

```
CPU: grid matrices (once)
GPU vertex:
  positionLocal  ← local corner with instance matrix applied
  + (0, sin(time + i * 0.13), 0)
  color = hash(i)
```

`instanceIndex` on InstancedMesh is 0..count-1.
`hash(instanceIndex)` is a fixed random color per copy.
`positionLocal` is a corner; the offset slides the whole
instance because the same Y is added to every corner.

## Code

`MeshStandardNodeMaterial.positionNode` and `colorNode`.
The slider is still only `.count`. The wave does not want
a JS loop.

## Try this

1. `0.13` → `1.2`. Why do neighbors run out of sync?
2. Add X to the offset too: `sin(time + i)` on X.
3. Make the `hash` color channels the same. Why does it go
   gray?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `drawCalls` stays low
- `triangles` = box triangles × count
- Performance: even if count rises, JS `update` should
  stay short

## Mini task

Scale with `instanceIndex`: `positionLocal * (0.6 + hash)`.
Mix small/large boxes; don't touch matrix scale.

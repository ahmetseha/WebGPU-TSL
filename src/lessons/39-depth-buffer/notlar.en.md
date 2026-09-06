# Lesson 39 — Depth Buffer

## Topic

The **depth buffer** stores each pixel's distance to the
camera as 0..1. 0 ≈ **near** plane, 1 ≈ **far**.

Why? The GPU decides “in front or behind” with depth, not
color. In post, fog, focus, AO all read this 0..1.

In a real project: soft particles, decals, contact shadow.

## How it works

```
pass(scene, camera)
  → color texture + depth texture
getDepthNode() / getLinearDepthNode()
  → gray screen: near light, far dark (linear)
```

Raw perspective depth piles most pixels toward 1. Linear
0..1 shows the near/far change in a readable way.

Grow near: the nearby sphere is cut (clip).
Shrink far: the far sphere fades / is cut; the gray range
squeezes.

## Code

`pipeline.outputNode = vec4(d, d, d, 1)` — no color, only
depth. Slider `camera.near` / `camera.far` +
`updateProjectionMatrix()`.

## Try this

1. Near 0.1 → 2. Why does the near sphere vanish?
2. Far 24 → 8. Where does the far sphere go on the gray
   scale?
3. Align the spheres with orbit. Which one is lighter
   gray?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `textures` includes the depth target
- Color draw calls still happen; you read depth in the
  output
- `chrome://gpu`

## Mini task

Invert depth with `oneMinus`. Near dark, far light.
Which one looks like a “fog map”?

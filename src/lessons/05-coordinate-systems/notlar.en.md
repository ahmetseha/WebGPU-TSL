# Lesson 5 — Coordinate systems

## Topic

A point is written five times: **local** (mesh), **world**
(scene), **view** (camera), **clip** (projection),
**screen** (pixel).

Why? Light lives in world, billboards in view, HUD on
screen. Wrong space = the “why is it sliding?” bug.

The yellow point is the world origin. The big sphere
**moves** — so local and world stay separate.

## How it works

```
positionLocal  × modelMatrix     → positionWorld
positionWorld  × viewMatrix      → positionView
positionView   × projection      → clip
clip / w                         → NDC (-1..1)
NDC → viewport                   → screen
```

Slider: 0 local, 1 world, 2 view. Color is pulled into 0–1
with `* 0.5 + 0.5`. When the mesh slides, the local pattern
stays stuck; world slides; view is tied to the camera axes.

## Code

`mix(local, world, clamp(u,0,1))` then
`mix(..., view, clamp(u-1,0,1))`. `uAlan` is a uniform.
`kure.position.x = sin(t)` changes world, not the local
vertex.

## Try this

1. In local the sphere goes left-right. Does the color
   pattern stay put? Guess.
2. Switch to world. Does the same motion slide the colors?
3. Orbit the camera. Do view colors rotate with you?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `chrome://gpu`
- `navigator.gpu`
- Draw call count does not rise when space changes — same
  mesh, different node
- No Spector.js on WebGPU

## Mini task

Leave a second sphere at the origin, color only
`positionWorld`. Catch the same moment as the moving
sphere: at which instant are the colors similar?

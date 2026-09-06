# Lesson 49 — Three.js debug

## Topic

`renderer.info` is Three.js's frame counter. The HUD
already shows it live; this lesson explains each field
**one by one** and freezes it with `console.table`.

Why? The sentence “the scene is slow” does not help.
Without a number you are guessing.

## How it works

| Field | Meaning |
| drawCalls | How many draw commands this frame |
| triangles | Triangles going to the raster (output pass +1 possible) |
| points | Point primitive count |
| lines | Line primitive |
| frameCalls | Render pass this frame |
| calls | Since the app opened — always rising |
| compute.frameCalls | Compute dispatch this frame |
| memory.geometries | Geometry held on the GPU |
| memory.textures | Texture held on the GPU |

Don't mix up `calls` and `drawCalls`. The first is
lifetime, the second is the frame.

The live overlay (`#hud`) is the same source. Extra
explanations live in `#istatistik-ek`.

## Code

`consolaYazdir` prints the same table as `window.__egitim`.
Add a sphere: drawCalls +1, geometries the same (shared
geo).

```js
window.__egitim.info()
window.__egitim.backend()
```

## Try this

1. console.table. Does `calls` rise if you print twice?
2. Add 5 spheres. drawCalls? geometries?
3. Why is compute.frameCalls 0? There is no compute in
   this scene.

## Browser DevTools

- Console: look at the table, read the rows
- `chrome://gpu`
- Don't use Spector.js — no WebGPU frame
- No need for Performance in this lesson; that's lesson 50

## Mini task

Add a wireframe (`LineSegments`). `lines` rises, how do
`triangles` change? Guess, then try.

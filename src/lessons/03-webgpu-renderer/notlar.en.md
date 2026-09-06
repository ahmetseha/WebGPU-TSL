# Lesson 3 — WebGPURenderer

## Topic

`WebGPURenderer` is Three.js's WebGPU (or WebGL 2 fallback)
driver. `init()`, size, pixel ratio, and the animation loop
live here.

Why a separate lesson? The scene is yours; **device and
frame loop** belong to the renderer. Wrong pixel ratio =
blurry or expensive frames.

In a real project camera / resize / loop are set up once —
in this app that is already done inside `createWebGPUApp`.

## How it works

```
new WebGPURenderer({ canvas, antialias })
  → await init()          // adapter + device
  → setPixelRatio / setSize
  → setAnimationLoop
       update(dt)
       render(scene, camera)
```

If WebGPU is missing the backend becomes **WebGL 2**. TSL
still works; the compiler emits GLSL.

Is it active?

- `renderer.backend.isWebGPUBackend === true`
- `chrome://gpu` → WebGPU: Hardware accelerated

## Code

`init()` already finished in the runner; don't call it again
in the lesson. The slider does `setPixelRatio` + `setSize`.
Canvas CSS size stays the same; the **drawing buffer**
changes. 0.5 = fewer pixels, 2 = retina cost.

## Try this

1. Ratio `0.5`. Why do edges look jagged?
2. Set `2`. Does FPS drop? Guess.
3. Shrink the window. You didn't write resize — who did?

## Browser DevTools

```js
window.__egitim.backend()
window.__egitim.info()
no app: renderer.backend.isWebGPUBackend
```

- `chrome://gpu`
- Right-click the canvas → inspect: if `width` / `height`
  attributes are larger than CSS, pixel ratio > 1
- Spector.js only on the WebGL fallback

## Mini task

Cap pixel ratio with `devicePixelRatio` (`Math.min(dpr, 2)`).
Why is 3–4x wasted on most scenes?

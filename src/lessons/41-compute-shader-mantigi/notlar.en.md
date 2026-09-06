# Lesson 41 — How compute shaders work

## Topic

A **render shader** draws triangles/points. A **compute
shader** does not draw; it writes numbers into a buffer.
That is called **GPGPU**:
General-Purpose GPU — compute outside of graphics.

Why is it strong? The same core hits 5000 points in
parallel. No JS loop, no attribute upload.

WebGPU compute is required. On the WebGL fallback this
lesson shows a message; positions are a static TSL hash.

In a real project: particle physics, cloth, histograms,
GPU cull.

## How it works

```
Render:
  vertex → triangle → fragment → screen

Compute:
  instanceIndex → formula → instancedArray[i] = vec3
  (no screen)

Then render:
  positionNode = buffer.toAttribute()
```

`renderer.compute(node)` dispatches every frame.
HUD `compute` (`info.compute.frameCalls`) should be > 0.

This sample is intentionally small: write an orbit, read,
draw.
Speed / collision are later lessons.

## Code

`instancedArray(N, "vec3")` + `Fn` + `compute(fn, N)`.
If it is not WebGPU, compute is not called.

## Try this

1. HUD `compute` on WebGPU: 0 or >0?
2. Speed slider. Why is there still no JS loop?
3. If the backend is WebGL, read the message. Why do the
   points sit still?

## Browser DevTools

Don't use Spector.js (it also does not see the compute
pass).

```js
window.__egitim.info()
window.__egitim.backend()
```

- `info.compute.frameCalls` — compute this frame
- `info.compute.calls` — session total
- `chrome://gpu` → WebGPU hardware
- The Rendering panel may stay WebGL-only

## Mini task

Inside compute add `sin(time + i)` to Y. Let the ring
breathe. Still write with `assign`, don't touch a CPU
array.

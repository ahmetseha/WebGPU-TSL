# Lesson 31 — TSL Particles

## Topic

Produce position on the GPU with **TSL** instead of writing
a CPU array.
Each point knows `instanceIndex` (which copy).

Why? Wiggling 10,000 points with a JS loop eats the CPU.
The GPU runs the same `sin(time)` expression 10,000 times
in parallel.

In a real project: procedural dust, UI particles, GPU rain.

## How it works

```
instanceIndex → hash() → fake random 0..1
time → sin → soft motion
positionNode / colorNode / sizeNode → Vertex
```

`hash(n)` is deterministic random. The same index is the
same seed every frame.
`range(min, max)` also produces a fixed random range per
instance.

`Points.count` is the instance count. One dummy vertex +
`count` makes `instanceIndex` 0..N-1. The buffer does not
carry xyz;
position lives entirely inside `positionNode`.

The WebGPU point primitive is 1px. `sizeNode` is more
visible on the WebGL fallback.
The distribution is still on the GPU.

## Code

`PointsNodeMaterial.positionNode = Fn(() => vec3(...))()`
`colorNode` and `sizeNode` change with the same
`instanceIndex`.
No array inside JS `update` — only `controls.update()`.

## Try this

1. `cos` instead of `sin`. How does the orbit turn?
2. `n1.mul(6)` → `mul(12)`. Why does the volume grow?
3. `sizeNode` multiplier 2 → 14. If the backend is WebGPU
   the difference is small.

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `drawCalls` still ~1
- `points` = count
- Performance: CPU frame should stay low (no JS loop)

## Mini task

Add an orbit radius with `hash` inside `positionNode`.
Let the points circle the center (`sin`/`cos` + `time`).

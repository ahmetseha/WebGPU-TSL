# Lesson 45 — Particle physics

## Topic

Simple particle physics is built from five forces:

- **Gravity** — constant acceleration `(0, g, 0)`
- **Velocity** — derivative of position
- **Friction** — `v *= 0.98` (damping)
- **Attraction** — toward the mouse
- **Repulsion** — the same vector, opposite sign

Why GPU? Every grain is the same formula; `instanceIndex`
is enough.
Mouse is `uniform vec3` — JS writes, compute reads.

In a real project: sparks, magic, UI particles, prototype
physics.

## How it works

```
v += (0, g, 0)
v += normalize(mouse - p) * power / dist * sign
v *= friction
p += v
if it hits the ground p.y = floor, v.y *= -bounce
```

Sign is `mix(1, -1, push)` — attract/repel without a
branch.

Canvas `pointermove` maps onto an NDC-like plane.
It can clash with OrbitControls; look at the particle
first.

## Code

One compute, two buffers. Ground is `step` + `mix`.
CPU fallback is the same Euler, `Float32Array` +
`needsUpdate`.

## Try this

1. Set gravity to 0. Why does it become “space dust”?
2. Repel + high mouse power. Why does it scatter like an
   explosion?
3. Friction 0.99. Why does it never stop?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- While you move the cursor `frameCalls` stays 1
  (uniform is cheap, not a new dispatch)
- `chrome://gpu`
- Don't use Spector.js

## Mini task

Stick to the ground instead of bouncing (`v.y = 0`). Make
friction higher on the ground. Does it become a “snow
pile” or “sloppy soup”?

## Recap

1. What is the difference between `uniform` and
   `instancedArray`?
2. Why are `compute.frameCalls` and `drawCalls` separate?
3. Why does Euler blow up with a large `dt`?

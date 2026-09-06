# Lesson 38 — Bloom

## Topic

**Bloom** — blur pixels above a threshold and add them
back onto the scene. The “light is leaking” feel.

Why do some objects glow? The material is **emissive**
(emitting) or a very bright color in HDR. A dark sphere
stays under the threshold and does not bloom.

**HDR** — color not squeezed into 0..1 (2.0, 4.0…). The
pass target holds HalfFloat; bloom can read it.

In a real project: neon, sun, magic, headlights.

## How it works

```
scene (high emissive)
  → pass texture (HDR)
  → threshold: cut the dark
  → blur (mip)
  → output = scene + bloom
```

When the threshold rises only the brightest core remains.
Strength is the coefficient of the added blurred light.

The dark `MeshBasic` sphere is intentional: no glow,
compare.

## Code

`bloom()` from addons. The slider writes `strength.value` /
`threshold.value`. `pipeline.render()` is required.
`dispose` also drops the bloom targets.

## Try this

1. Threshold 0. Threshold 0.9. Which one is “everything
   fog”?
2. Strength 0. No bloom — is the emissive sphere still
   bright?
3. Make the dark sphere emissive 3 (guess before the mini
   task: it gets a halo too).

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `memory.textures` rises with bloom mips
- `drawCalls` rises because of blur passes
- `chrome://gpu`

## Mini task

Set the yellow sphere's `emissiveNode` multiplier 4.2 →
0.4.
At threshold 0.35, does the halo vanish? Why?

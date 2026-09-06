# Lesson 36 — How post-processing works

## Topic

A **render target** is a buffer the GPU draws into a
**texture** instead of the screen. Post-processing: take
the scene into that texture, apply an effect, stamp the
result to the screen.

Why? Bloom, color grading, UI overlay do not model the
scene a second time. One extra full-screen pass is enough.

In a real project: film look, damage flash, night vision.

## How it works

```
renderer.render(scene, camera)     → straight to the screen
         ↓
pass(scene, camera)                → Render Target
getTextureNode()                   → that target's color
effect (mix tint)                  → new color
RenderPipeline.render()            → quad → screen
```

If the runner sees `render()`, it does **not** call
`renderer.render`.
If you call both, the scene is drawn twice.

The tint is ugly on purpose: it proves the pass is
running.
When you turn it off, the raw scene texture arrives.

## Code

`new RenderPipeline(renderer)` + `outputNode = mix(...)`.
Handle: `{ render: () => pipeline.render(), dispose }`.

## Try this

1. Tint off/on. Why does the whole scene warm up, not one
   mesh?
2. `0.22` → `0.8`. Why does the scene disappear?
3. Does HUD `textures` rise? (target texture)

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- `memory.textures` — the pass target can raise the count
- `drawCalls` — scene + full-screen quad
- `chrome://gpu`

## Mini task

Write `sahneRenk.rgb.mul(vec3(1, 0.2, 1))` instead of tint.
Magenta proof-pass. Mix amount with a slider.

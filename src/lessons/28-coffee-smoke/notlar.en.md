# Lesson 28 — Coffee smoke

## Topic

A small consistent scene: cylinder cup, torus rim, torus
handle, coffee disk, **smoke plane**.

Smoke is a mesh; it is not a particle. Noise + UV scroll
up + edge mask + `depthWrite false`.

Why use it? Stylized steam is cheap. Thousands of particles
are not required.

In a real project cup, chimney, incense, breath — the same
plane card.

## How it works

```
cup (opaque, depth is written)
smoke plane
  uv' = uv + (noise*0.12, -time*speed)
  n   = noise(uv' * 4)
  mask = smoothstep edge X and Y
  alpha = n * mask * density
  DoubleSide, transparent, depthWrite = false
  every frame lookAt(camera)  billboard
```

`depthWrite false` stops the smoke from “cutting” the cup.
Soft edge: alpha 0 at UV 0/1. At the top
`smoothstep(1, 0.32, y)` fades the smoke out.

Horizontal noise offset wrinkles a flat scroll — not wind,
cheap domain warp.

## Code

`kameraSifirla` target is `(0, 0.45, 0)` — the cup.
Sliders only touch the smoke graph.

The handle is a full torus; enough silhouette for teaching.

## Try this

1. Density `0`. The cup stays, why does the smoke vanish?
   Is alpha zero?
2. Speed `0`. Why is the steam a frozen photo? Scroll
   stopped; is the noise still there?
3. Orbit. Why does the plane always face you? Which axis
   does `lookAt` crush?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — cup parts + coffee + smoke + output. No
  particles.
- `memory.textures` — no CanvasTexture; smoke is
  procedural.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Add a second octave to the smoke (`olçek * 2`). Why does
one octave look like “dough”, two octaves like a “steam
thread”?

# Lesson 25 — Fresnel

## Topic

**Fresnel** — reflection grows as the view angle becomes
more perpendicular to the surface normal. The edge glows,
the center darkens (or the reverse).

Formula (teaching):

```
V = normalize(cameraPosition - positionWorld)
F = pow(1 - saturate(abs(N·V)), power)
```

Simple alternative: `dot(normalView, vec3(0,0,1))` —
“forward” in camera space. World space stays correct when
the camera turns.

Why use it? Rim light, hologram, shield, planet atmosphere,
wet eye.

## How it works

```
N · V ≈ 1   face looking at us     F ≈ 0
N · V ≈ 0   silhouette / tangent   F ≈ 1
```

- **Rim** — albedo + edge color. Opaque.
- **Hologram** — F + horizontal scan + emissive + alpha.
- **Shield** — F * noise. Intersection feel: edge and
  blotches together.
- **Atmosphere** — dark inner sphere + outer shell
  `opacity = F`.

`depthWrite = false` so the transparent shell does not
crush the inner planet.

## Code

`abs(dot)` lights the back face too (thin shell). Drop
`abs` if you want one side only.

The power slider thins the ring by raising the exponent.

## Try this

1. Power `0.8` → `5`. Why does the edge thin like a thread?
   High `pow` exponent?
2. **Hologram**. Scan lines are on UV.y. Orbit: do the
   lines turn with the object?
3. **Atmosphere**. Why is the middle a hole? Is
   `opacity = F` ~0 at the center?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — inner sphere + shell + output.
- Transparent + `depthWrite false` increases overdraw;
  look at frame ms.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Drop `abs` and look from inside the sphere (orbit). Why
does the back face go dark? For a two-sided shield do you
need `side = DoubleSide`?

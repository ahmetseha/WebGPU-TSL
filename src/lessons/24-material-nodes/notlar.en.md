# Lesson 24 — Material nodes

## Topic

A node material is an **input panel**. Each channel accepts
its own TSL graph:

- `colorNode` — albedo
- `roughnessNode` / `metalnessNode` — PBR
- `emissiveNode` — its own light (bloom bait, later
  sections)
- `opacityNode` — alpha, `transparent = true` required
- `positionNode` / `normalNode` — covered in 20–22

Why use it? You bind a function instead of a bitmap: wet
edge, rust mask, pulse emission.

In a real project every “smart material” is these sockets
filled in.

## How it works

```
slider → uniform.value  (CPU, one float per frame)
       → GPU fragment
           color     = vec3(r,g,b)
           roughness = roughness
           metalness = metal
           emissive  = orange * emission
           opacity   = opacity
```

`roughness = 0` + `metalness = 1` ≈ mirror. `emissive`
glows even without a light — not like Basic; PBR still
stacks on top.

Opacity 0.2: the sphere becomes glass. Depth write may
stay on; sorting artefacts are normal.

## Code

One sphere, one `MeshStandardNodeMaterial`. The slider
writes the uniform via `sayiBagla`. The graph is not
rebuilt.

## Try this

1. Roughness `1` → `0`. Why does the highlight shrink and
   get sharp?
2. Metalness `0` → `1` (low roughness). Why does the
   environment color (light color) overpower albedo?
3. Emissive `1.5`, opacity `0.3`. Why both glass and lava
   lamp?

## Browser DevTools

Don't use a WebGL tool. Spector.js does not work on this
scene.

```js
window.__egitim.info()
window.__egitim.backend()
```

- Turning a slider does not change `drawCalls`. Uniforms
  are cheap.
- `transparent` can increase overdraw; look at frame ms in
  Performance.
- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag needed

## Mini task

Bind `roughnessNode = uv().y` (forget the slider for a
moment). Why is the bottom matte, the top wet? Is UV.y
bottom to top?

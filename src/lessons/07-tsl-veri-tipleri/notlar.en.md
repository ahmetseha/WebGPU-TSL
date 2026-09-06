# Lesson 7 — TSL data types

## Topic

The GPU speaks scalars and vectors: `float`, `int`, `bool`,
`vec2`, `vec3`, `vec4`, `color`, `mat3`, `mat4`.

Why? The wrong type breaks compile or makes swizzle
nonsense. `uv` is vec2, position is vec3, RGBA is vec4.

In a real project every uniform and every node has a type.
The left plane shows the type; the right cube paints
`vec3` local position.

## How it works

```
float  → single channel (gray)
vec2   → RG, B=0          (UV)
vec3   → RGB
vec4   → RGBA (a: opacity / clip)
color  → 0–1 RGB, color-space hint
mat3/4 → rotate, scale, projection
int    → index, counter
bool   → select / step
```

`vec3(uv.x, uv.y, 0)` **debugs** a vec2 as color. Cube:
`positionLocal * 0.5 + 0.5` — each axis is a channel.

## Code

The plane uses `mix` for float → vec2 → vec3. The cube is
`colorNode = positionLocal.mul(0.5).add(0.5)`. `int` /
`bool` / matrices are not visible here; they live inside
the shader.

## Try this

1. `float`: why only a gray ramp?
2. `vec2`: is green (V) at the top? Guess.
3. Rotate the cube. Colors are stuck to the mesh — which
   type, which space?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- A type error becomes a TSL / WGSL message in the console
- `chrome://gpu`
- `navigator.gpu`
- Two meshes ≈ two draws; the type button does not add draws

## Mini task

Give the plane `vec4(uv.x, uv.y, 0, uv.x)` and set
`opacityNode` to `.w`. Why does the left side fade?

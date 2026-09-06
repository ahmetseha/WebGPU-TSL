# Lesson 8 — TSL operations

## Topic

TSL operations are not a list to memorize: **you see
them**. All of them run on `uv.x` (0→1 left to right).

Why? Pattern, mask, soft edge, vibration — they all come
from the same five functions.

In a real project `mix` is color, `smoothstep` is an
antialiased band, `step` is a threshold, `clamp` is a
bound, `sin` is oscillation.

## How it works

```
uv.x
  mix(A,B,x)         → flat gradient
  smoothstep band    → soft stripe (default)
  sin(x*24)          → wave
  step(0.5, x)       → hard cut
  clamp(2x-0.5,0,1)  → gradient squeezed in the middle
```

`smoothstep(e0,e1,x)` is an S-curve between e0–e1. A band:
one rising edge minus another rising edge.

## Code

`bant = smoothstep(0.35,0.45,x) - smoothstep(0.55,0.65,x)`.
Buttons pick `uMod`; the shader is not rewritten.

## Try this

1. The `step` vs `smoothstep` edge. Which one aliases?
2. `clamp`: why is the left a flat color? Guess
   (`2x-0.5 < 0`).
3. `sin`: how many peaks are you counting? 24 / 2π ≈ ?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- The button does not raise `drawCalls` — one plane
- `chrome://gpu`
- `navigator.gpu`
- No Spector on WebGPU; verify the operation with your eye

## Mini task

Set the `smoothstep` thresholds to `0.1` and `0.9`. Why
does the band swell? Try `sin(x*24)+sin(x*6)` instead of
`sin(x*24)`.

# Lesson 10 — Uniform

## Topic

A **uniform** is a value that goes from CPU to GPU and
stays **constant for the frame**: color, speed, strength.
Every vertex and every fragment reads **the same** uniform.

Why? You don't recompile the shader every frame. Slider =
`uniform.value`.

In a real project time, mouse, theme color, metalness —
they pack into a bind group. Three + TSL hide that with
`uniform()`.

## How it works

```
JS:  renkDeger.set / uHiz.value = n
        ↓
Three: uniform node
        ↓
WebGPU: bind group + buffer
        ↓
Shader: every thread reads the same value
```

An `attribute` changes from vertex to vertex. A `uniform`
does not change for the call. `time` is Three's own
uniform; `uHiz` scales it.

## Code

`const uRenk = uniform(renkDeger)` — Color object reference.
The slider writes `renkDeger.r/g/b`.
`colorNode = uRenk * uGuc * (sin(time*uHiz)*0.2+0.8)`.

## Try this

1. Speed `0`. Pulse stops, color stays. Which uniform
   froze?
2. Strength `0`. Why is the sphere black? Guess.
3. Color slider: JS `Color` changes, the shader line does
   not. Why?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Updating a uniform is not a new pipeline
- `chrome://gpu`
- `navigator.gpu`
- On WebGPU the bind group is not visible in Spector

## Mini task

Add a fourth uniform `uKesim`: darken `colorNode` when it
is below `uKesim`. The slider threshold should come from
JS.

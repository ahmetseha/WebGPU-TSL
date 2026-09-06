# Lesson 11 — Variable (toVar)

## Topic

TSL nodes are **immutable**: `uv().mul(8)` produces a new
node, it does not write the old one. `.toVar("ad")` opens a
**variable** in the shader: it names the intermediate
result and does not recompute it.

Why? Long patterns stay readable; the compiler does not
write the same expression twice.

In a real project, every step in a noise + mask + color
chain is `toVar`. `assign` lives inside `Fn` (next lesson).

## How it works

```
uv            immutable
  * scale     new node → toVar("olcekli")
  fract       new node → toVar("hucre")
  x * y       new node → toVar("karisim")
  mix         color
```

Don't confuse this with JS `const`: the JS reference is
fixed; on the GPU side `var` can be written again. The
chain here only names things.

`fract` is the fraction — cell UV (0–1) from 8 repeats.

## Code

`uv().mul(uOlcek).toVar("olcekli")` → `fract` →
`hucre.x.mul(hucre.y).toVar("karisim")` → `mix`. The slider
changes scale; the graph stays the same.

## Try this

1. Scale `2` → `16`. Why do the cells shrink? Guess.
2. Why is the bottom-left corner always dark? (`x*y` is 0
   there)
3. If you delete `toVar`, does the image change?
   Readability?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `toVar` does not add a draw call
- `chrome://gpu`
- `navigator.gpu`
- Names may minify in WGSL; you still see the TSL name

## Mini task

After `hucre` add `length(hucre - 0.5).toVar("d")`. Let the
`mix` t be `d`. Do circles appear in the cells?

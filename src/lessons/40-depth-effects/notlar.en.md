# Lesson 40 — Depth Effects

## Topic

Depth is a **mask**. If you mix color with 0..1 you get
fog, a palette, or a rough focus.

Why? Instead of putting `Fog` in the scene you can control
it in post: the same depth, three different looks.

In a real project: atmospheric fog, heat haze, DIY DoF.

## How it works

```
fog:    mix(scene, fogColor, depth)
color:  mix(blue, red, depth)
focus:  sharp ↔ 5-sample average
        t = saturate(|depth - focus| * 4)
```

Focus is **not a real Gaussian**. Sampling 5 times with a
shifted UV is a cheap “blur-ish”. Pixels far from the
focus uniform blur more.

## Code

The same `pass` + `getDepthNode`/`getLinearDepthNode`.
The button changes `outputNode`. The focus slider is a
uniform.

## Try this

1. Fog: why does the far sphere sink into the sky?
2. Depth color: which one is red — why that one?
3. Focus 0 → 1. Why does the sharp plane slide?

## Browser DevTools

Don't use Spector.js.

```js
window.__egitim.info()
```

- Focus 5 texture samples: fragment cost rises, not draw
  call
- Performance can be GPU bound
- `window.__egitim.backend()`

## Mini task

Make fog color a uniform. Try orange dusk fog with a
slider. Depth is still the same mask.

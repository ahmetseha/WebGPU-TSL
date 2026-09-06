# Lesson 52 — GPU errors

## Topic

WebGPU **validation** errors show in the Console before
the tab crashes. This lesson does not drop the tab on
purpose; each button tells you what you will see with
`console.warn`.

What you need to recognize:

- **navigator.gpu missing** — no API / permission / old
  browser
- **shader compile** — TSL → WGSL compile error
- **invalid buffer** — size, usage, offset
- **binding** — layout ≠ resource
- **pipeline validation** — vertex format / shader mismatch
- **device lost** — driver reset, timeout
- **OOM** — out of memory
- **WebGPU validation** — general red `[Invalid ...]`

## How it works

```
JS command → WebGPU validation
  → warn/error Console
  → draw is skipped or device lost
```

A harmless `uniform({ x: "metin" })` can pass in JS;
the real type breaks when it goes to the GPU. That is why
“silent accept” ≠ a correct shader.

We are not doing an OOM demo: producing a 4K buffer locks
the tab.

## Code

Buttons produce logs. `requestAdapter` is safe.
The red sphere on the HUD shows the scene is alive.

## Try this

1. navigator.gpu. Object, or missing?
2. Validation button. What is in the Console?
3. Compare with chrome://gpu “Hardware accelerated”.

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Console filter: turn Verbose on; validation is there
- `chrome://gpu`
- Spector.js does not show these errors on WebGPU
- Reloading the tab is the right recovery after device
  lost

## Mini task

Don't deliberately write something like `colorNode = 3`
(don't break the lesson file). Instead read an old
validation message in the Console: which word tells you
the type?

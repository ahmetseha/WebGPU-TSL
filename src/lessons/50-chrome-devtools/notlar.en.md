# Lesson 50 — Chrome DevTools

## Topic

This lesson uses the scene as an excuse; the real work is
the Chrome tabs.

- **Console** — runtime, warnings, WebGPU validation,
  shader
- **Performance** — frame time. 60 Hz ≈ **16.67 ms**
- **Memory** — heap + leak. A texture that was not
  disposed
- **Network** — this project has no heavy GLB/HDR. In real
  work look at texture, model, HDR size
- **Rendering** (three dots → More tools) — FPS meter,
  paint flashing, layer borders

Don't turn on old `chrome://flags` WebGPU rows. In current
Chrome, WebGPU is default. Check: `chrome://gpu`.

## How it works

```
Console     → what broke
Performance → where 16.67 ms was crossed
Memory      → what piled up
Network     → what was downloaded
Rendering   → how the browser painted
```

CPU bottleneck: main thread busy, JS long.
GPU bottleneck: the frame swells on the GPU, JS can look
idle.

## Code

“Leak texture” produces a `DataTexture` and binds it to
the scene.
HUD `textures` rises. When you “dispose” it drops. An
unbound texture may not enter `info.memory` — that is why
there is a mesh.

## Try this

1. In the Console `window.__egitim.info()`
2. Performance: record 3 s. Is the frame ~16 ms?
3. Leak → textures. Clean → did it drop?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `chrome://gpu` → WebGPU: Hardware accelerated
- No flag
- Spector.js does not work on WebGPU (lesson 51)

What you look for on Network: `.hdr`, `.glb`, 4K PNG,
font.
This course does not have them — absence is also a lesson.

## Mini task

Open Rendering → Frame Rendering Stats. If FPS and HUD
FPS split, why? (browser vs app counter)

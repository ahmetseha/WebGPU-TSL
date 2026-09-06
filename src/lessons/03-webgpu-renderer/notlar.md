# Ders 3 — WebGPURenderer

## Konu

`WebGPURenderer` Three.js’in WebGPU (veya WebGL 2 yedek) sürücüsüdür. `init()`, boyut, pixel ratio ve animation loop burada yaşar.

Neden ayrı ders? Sahne senin, **cihaz ve kare döngüsü** renderer’ın. Yanlış pixel ratio = bulanık veya pahalı kare.

Gerçek projede kamera / resize / loop bir kez kurulur — bu uygulamada `createWebGPUApp` içinde bitti.

## Mantık

```
new WebGPURenderer({ canvas, antialias })
  → await init()          // adapter + device
  → setPixelRatio / setSize
  → setAnimationLoop
       update(dt)
       render(scene, camera)
```

WebGPU yoksa backend **WebGL 2** olur. TSL yine çalışır; derleyici GLSL üretir.

Aktif mi?

- `renderer.backend.isWebGPUBackend === true`
- `chrome://gpu` → WebGPU: Hardware accelerated

## Kod

`init()` runner’da bitti; derste tekrar çağırma. Slider `setPixelRatio` + `setSize` yapar. Canvas CSS boyutu aynı kalır, **drawing buffer** değişir. 0.5 = daha az piksel, 2 = retina maliyeti.

## Deney

1. Ratio `0.5`. Kenarlar neden testere gibi?
2. `2` yap. FPS düşer mi? Tahmin et.
3. Pencereyi küçült. Resize’ı sen yazmadın — kim yaptı?

## Browser DevTools

```js
window.__egitim.backend()
window.__egitim.info()
app yok: renderer.backend.isWebGPUBackend
```

- `chrome://gpu`
- Canvas’a sağ tık → incele: `width` / `height` attribute CSS’ten büyükse pixel ratio > 1
- Spector.js yalnızca WebGL yedekte

## Mini görev

Pixel ratio’yu `devicePixelRatio` ile sınırla (`Math.min(dpr, 2)`). Neden 3–4x çoğu sahnede boşa gider?

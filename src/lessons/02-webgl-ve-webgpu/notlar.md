# Ders 2 — WebGL ve WebGPU

## Konu

**WebGL 2** eski OpenGL ES 3.0 köprüsüdür. **WebGPU** modern GPU API’sidir: Vulkan / Metal / D3D12 modelini tarayıcıya taşır.

Neden? Daha az sürücü maliyeti, açık **compute**, açık **command buffer**. Three.js `WebGPURenderer` ikisini de konuşur; sen draw call yazmazsın.

Gerçek projede her `WebGPURenderer` sahnesi bu hatayı kullanır. Flag gerekmez.

## Mantık

```
CPU (Three.js)
  → Queue
    → Command Buffer
      → Render Pass
        → Pipeline + Bind Group
          → GPU
```

- **Command buffer** — “şunu çiz” kayıtları
- **Render pass** — bir hedefe (renk / derinlik) boyama turu
- **Pipeline** — vertex + fragment program + durum
- **Bind group** — uniform, texture, sampler paketi

WebGL’de bu parçalar dağınık `gl.` çağrılarıdır. WebGPU’da nesnedir. Three.js-dev seviyesinde sen pipeline yazmazsın; renderer üretir.

## Kod

`renderer.backend.isWebGPUBackend` gerçek backend. `navigator.gpu.requestAdapter()` cihazı seçer. `adapter.info` vendor / mimari verir. Bu derste tek küp = tek draw path.

## Deney

1. Backend butonu. WebGPU mi WebGL 2 mi? Tahmin et, sonra bak.
2. `navigator.gpu` yoksa renderer yine çalışır mı?
3. `adapter.info` boş string dönerse ne anlama gelir? (gizlilik)

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
await navigator.gpu?.requestAdapter()
  .then((a) => a?.info)
```

- `chrome://gpu` → WebGPU: Hardware accelerated
- Spector.js yalnızca backend **WebGL 2** ise
- Flag gerekmez

## Mini görev

Aynı küpü silmeden HUD’a `adapter.info.vendor` yaz. Backend değişmeden vendor değişir mi? Neden?

# Ders 53 — Bitirme projesi

## Konu

Tek ruh hali: **alacakaranlıkta karlı tepe, sessiz kamp**.

Bir arada (çöplük değil):

- Prosedürel arazi (aynı fonksiyon yerleştirmede)
- Instanced çam / kaya
- Kabin + baca dumanı
- Fresnel kalkan küresi
- Kar (WebGPU compute, değilse CPU)
- Bloom + vignette
- Titreyen pencere ışığı
- HUD zaten FPS / draw / compute gösterir

Neden bu sahne? Öğrendiklerin tek yerde: TSL malzeme,
instance, compute, post, ışık, sis.

## Mantık

```
araziY → vertex + ağaç/kaya matrisi
compute kar: düş, rüzgar, kameradan kaç, yere değince doğ
compute duman: yüksel, tavanda yeniden doğ
fresnel = 1 - |N · V|
pass(scene) → bloom → vignette → RenderPipeline.render
```

Draw call az: 1 arazi, 2 çam instance, 1 kaya, birkaç
kabin mesh, 1 kalkan, 2 parçacık. Compute ayrı sayaç.

## Kod

`RenderPipeline` varsa `render()` sen verirsin; runner
`renderer.render` çağırmaz. Compute `update` içinde,
pipeline `render` içinde.

Bloom eşik 0.74 — kar parlamasın, pencere/kalkan parlasın.

## Deney

1. Bloom kapat. Neden kamp “daha soğuk” görünür?
2. Rüzgar. Kar ve duman aynı `uniform`’u paylaşır mı?
3. HUD: `compute.frameCalls` WebGPU’de 2 (kar+duman).

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
window.__egitim.backend()
```

- Performance: 16.67 ms çizgisi
- `chrome://gpu`
- Spector.js WebGPU’yu yakalamaz
- Memory: ders değiştirince runner sahneyi temizler

## Mini görev

Kalkana çok hafif `mx_noise_float(time)` ekle. Kalkan
“nefes alsın” ama kampın sessizliğini bozmasın.

## Tekrar

1. Neden 50 ağaç 50 Mesh değil?
2. Compute ile vertex shader farkı?
3. FPS yetmez; başka ne okursun?

# Ders 41 — Compute Shader mantığı

## Konu

**Render shader** üçgen/nokta çizer. **Compute shader**
çizmez; tampona sayı yazar. Buna **GPGPU** denir:
General-Purpose GPU — grafiğin dışında hesap.

Neden güçlü? Aynı çekirdek 5000 noktaya paralel. JS
döngüsü yok, attribute upload yok.

WebGPU compute şart. WebGL fallback’te bu ders mesaj
gösterir; konumlar statik TSL hash’tir.

Gerçek projede: parçacık fizik, cloth, histograma,
GPU cull.

## Mantık

```
Render:
  vertex → triangle → fragment → ekran

Compute:
  instanceIndex → formül → instancedArray[i] = vec3
  (ekran yok)

Sonra render:
  positionNode = tampon.toAttribute()
```

`renderer.compute(node)` her kare dispatch eder.
HUD `compute` (`info.compute.frameCalls`) > 0 olmalı.

Bu örnek kasıtlı küçük: yörünge yaz, oku, çiz.
Hız / çarpışma sonraki dersler.

## Kod

`instancedArray(N, "vec3")` + `Fn` + `compute(fn, N)`.
WebGPU değilse compute çağrılmaz.

## Deney

1. HUD `compute` WebGPU’da 0 mı, >0 mı?
2. Hız slider. Neden JS döngüsü hâlâ yok?
3. Backend WebGL ise mesajı oku. Noktalar neden durur?

## Browser DevTools

Spector.js kullanma (compute pass’i de görmez).

```js
window.__egitim.info()
window.__egitim.backend()
```

- `info.compute.frameCalls` — bu kare compute
- `info.compute.calls` — oturum toplamı
- `chrome://gpu` → WebGPU hardware
- Rendering panel WebGL’e özel kalabilir

## Mini görev

Compute içinde Y’ye `sin(time + i)` ekle. Halka nefes
alsın. Hâlâ `assign` ile yaz, CPU dizi dokunma.

# Ders 50 — Chrome DevTools

## Konu

Bu ders sahneyi bahane eder; asıl iş Chrome sekmeleri.

- **Console** — runtime, uyarı, WebGPU doğrulama, shader
- **Performance** — kare süresi. 60 Hz ≈ **16.67 ms**
- **Memory** — heap + sızıntı. dispose edilmeyen doku
- **Network** — bu projede ağır GLB/HDR yok. Gerçek
  işte texture, model, HDR boyutuna bak
- **Rendering** (üç nokta → More tools) — FPS meter,
  paint flashing, layer borders

Eski `chrome://flags` WebGPU satırlarını açma. Güncel
Chrome’da WebGPU varsayılan. Kontrol: `chrome://gpu`.

## Mantık

```
Console     → ne kırıldı
Performance → nerede 16.67 ms aşıldı
Memory      → ne birikti
Network     → ne indirildi
Rendering   → tarayıcı nasıl boyadı
```

CPU darboğazı: ana iş parçacığı meşgul, JS uzun.
GPU darboğazı: kare GPU’da şişer, JS boşta görünebilir.

## Kod

“Doku sızdır” `DataTexture` üretir ve sahneye bağlar.
HUD `textures` artar. “dispose” düşünce düşer. Bağlanmayan
doku `info.memory`’ye girmeyebilir — bu yüzden mesh var.

## Deney

1. Console’da `window.__egitim.info()`
2. Performance: 3 sn kaydet. Frame ~16 ms mi?
3. Sızdır → textures. Temizle → düştü mü?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag yok
- Spector.js WebGPU’de çalışmaz (51. ders)

Network’te ne ararsın: `.hdr`, `.glb`, 4K PNG, font.
Bu eğitimde bunlar yok — yokluk da bir derstir.

## Mini görev

Rendering → Frame Rendering Stats aç. FPS ile HUD
FPS ayrılırsa neden? (tarayıcı vs uygulama sayacı)

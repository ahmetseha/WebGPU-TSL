# Ders 5 — Koordinat sistemleri

## Konu

Bir nokta beş kez yazılır: **local** (mesh), **world** (sahne), **view** (kamera), **clip** (projeksiyon), **screen** (piksel).

Neden? Işık world’de, billboard view’da, HUD screen’de yaşar. Yanlış uzay = “neden kayıyor?” bug’u.

Sarı nokta dünya orijini. Büyük küre **hareket eder** — local ile world ayrılsın diye.

## Mantık

```
positionLocal  × modelMatrix     → positionWorld
positionWorld  × viewMatrix      → positionView
positionView   × projection      → clip
clip / w                         → NDC (-1..1)
NDC → viewport                   → screen
```

Slider: 0 local, 1 world, 2 view. Renk `* 0.5 + 0.5` ile 0–1’e çekilir. Mesh kayınca local desen yapışık kalır; world kayar; view kamera eksenine bağlıdır.

## Kod

`mix(local, world, clamp(u,0,1))` sonra `mix(..., view, clamp(u-1,0,1))`. `uAlan` uniform. `kure.position.x = sin(t)` world’ü değiştirir, local vertex’i değil.

## Deney

1. Local’de küre sağa-sola gider. Renk deseni duruyor mu? Tahmin et.
2. World’e al. Aynı hareket renkleri kaydırır mı?
3. Orbit ile kamera dön. View renkleri seninle döner mi?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `chrome://gpu`
- `navigator.gpu`
- Draw call sayısı uzay değişince artmaz — aynı mesh, başka node
- Spector.js WebGPU’da yok

## Mini görev

İkinci bir küre orijinde dursun, rengi yalnızca `positionWorld` olsun. Hareket eden küreyle aynı anı yakala: hangi anda renkler benzer?

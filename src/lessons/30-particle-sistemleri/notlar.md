# Ders 30 — Particle sistemleri

## Konu

**Particle** (parçacık) tek başına üçgen mesh değil, bir **nokta**dır.
Binlerce nokta duman, yıldız, kıvılcım, kar için yeter.

Neden kullanılır? 10.000 ayrı `Mesh` ≈ 10.000 **draw call**.
10.000 `Points` ≈ **1 draw call**. GPU her noktayı paralel okur.

Gerçek projede: yağmur, kıvılcım, UI confetti, uzay tozu.

## Mantık

```
CPU: Float32Array konumları yazar
  → BufferAttribute (GPU tamponu)
    → BufferGeometry
      → Points (tek çizim)
GPU: her vertex = bir nokta
```

**Attribute** — geometrinin GPU’da tuttuğu dizi.
`position` itemSize 3: `x,y,z, x,y,z, ...`

CPU her kare `array` yazar, `needsUpdate = true` der.
Yükleme CPU→GPU bandını yer. Bu yüzden GPU particles güçlüdür:
konumu shader yazar, upload olmaz.

## Kod

`BufferGeometry.setAttribute("position", new BufferAttribute(dizi, 3))`
sonra `new Points(geo, PointsMaterial)`. HUD’da `points` artar,
`drawCalls` tek kalır. Slider adedi değiştirir; mesh sayısı 1 kalır.

## Deney

1. Adet 200 → 12000. FPS ve `points` ne olur, `drawCalls`?
2. **CPU yaz** kapat. Neden durur?
3. `size` 0.045 → 0.2. WebGPU’da nokta 1px kalır mı?

## Browser DevTools

Spector.js kullanma; WebGPU karelerini görmez.

```js
window.__egitim.info()
```

- `render.points` — bu karedeki nokta
- `render.drawCalls` — 1 civarı kalmalı
- `chrome://gpu` → WebGPU: Hardware accelerated

## Mini görev

Her noktaya `color` attribute (itemSize 3) ekle. Merkeze yakın
noktaları sıcak, uzağı soğuk boya. `PointsMaterial.vertexColors`.

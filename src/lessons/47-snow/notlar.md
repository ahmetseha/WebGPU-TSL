# Ders 47 — Kar

## Konu

Kar, 45. dersin fiziğinin “yer”e bağlanmış hali: rastgele
doğum, düşüş hızı, rüzgar, dönüş, boyut, kameradan kaçınma,
yere değince yukarı yeniden doğma.

Neden compute? Binlerce bağımsız tanecik. CPU yedek aynı
döngü — WebGL’de `compute.frameCalls` 0 kalır.

Gerçek projede: kış sahnesi, kül, toz, yaprak.

## Mantık

```
p += v
p.x += rüzgar
p.z += sin(time + hash)     // salınım
kamera yakınsa p += normalize(p - cam) * kaçın
y < zemin ise p = yeni doğum (yüksekte)
```

Dönüş ve boyut **çizim** tarafında: `rotationNode`,
`sizeNode`. Compute sadece noktayı taşır.

WebGPU 1 px `Points` kullanma — `Sprite` +
`SpriteNodeMaterial` taneyi görünür kılar.

## Kod

`uniform` kamera her kare JS’den yazılır. Recycle
`step(p.y, 0.06)` + `mix`. Hash + time yeni XZ verir;
aynı index tekrar kullanılır, buffer büyümez.

## Deney

1. Rüzgarı sona çek. Neden kar “yağmur gibi” yatay gider?
2. Kamerayı tanelerin içine sok. Savrulma var mı?
3. Adet sabit 3500. `drawCalls` 2 (zemin + kar). Neden?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- WebGPU: her kare 1 compute
- `chrome://gpu`
- Spector.js kar compute’unu yakalamaz

## Mini görev

Doğum kutusunu küçült (8 → 4). Kar neden “perde” gibi
kameranın önünde birikir?

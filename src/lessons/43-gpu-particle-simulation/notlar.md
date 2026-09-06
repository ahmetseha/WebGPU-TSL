# Ders 43 — GPU parçacık simülasyonu

## Konu

Bir parçacık **konum + hız** taşır. Her kare:

`velocity += kuvvet` sonra `position += velocity`.

Neden compute? Aynı Euler adımı 4000–8000 kez; GPU bunu
tek dispatch’te yapar. CPU yedek aynı formül, tek çekirdek.

Gerçek projede: duman, kıvılcım, sürü, kar.

## Mantık

```
init compute (bir kez)
  konum ~ hash(instanceIndex)
  hız   ~ küçük rastgele

her kare compute
  v += hafif sin kuvvet
  v *= sürtünme
  p += v

çizim
  Sprite.count = adet
  positionNode = konumlar.toAttribute()
```

Adet slider’ı buffer’ı yeniden kurar. `instancedArray`
boyutu sabit — büyütmek yeni depo demektir.

WebGPU’de boyutlu tanecik = `Sprite` + `PointsNodeMaterial`.
`Points` primitive’i 1 px kalır.

## Kod

İki `instancedArray`: `vec3` konum, `vec3` hız.
`uniform` sürtünme JS’den değişir; GPU her kare okur.
HUD `compute.frameCalls` 1 olmalı (init ayrı karede).

## Deney

1. Adet 500 → 8000. FPS ve `points` nasıl değişir?
2. Sürtünme 0.90. Neden hız çabuk ölür?
3. WebGL’de `compute.frameCalls` 0 kalır. Simülasyon
   neden yine görünür?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- Adet değişince `memory` biraz oynar (yeni buffer)
- `chrome://gpu` — WebGPU satırı
- Spector.js yok; WebGPU compute’u görmez

## Mini görev

Yere düşünce (`p.y < 0`) hız Y’yi ters çevir. `step` / `mix`
ile dal yap (TSL’de `If` şart değil). Zıplama görünür mü?

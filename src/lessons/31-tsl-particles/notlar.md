# Ders 31 — TSL Particles

## Konu

Konumu CPU dizisine yazmak yerine **TSL** ile GPU’da üret.
Her nokta `instanceIndex` (kaçıncı kopya) bilir.

Neden? 10.000 noktayı JS döngüsüyle kımıldatmak CPU’yu yer.
GPU aynı `sin(time)` ifadesini 10.000 kez paralel koşturur.

Gerçek projede: procedural toz, UI parçacık, GPU rain.

## Mantık

```
instanceIndex → hash() → sahte rastgele 0..1
time → sin → yumuşak hareket
positionNode / colorNode / sizeNode → Vertex
```

`hash(n)` deterministik rastgele. Aynı index her kare aynı tohum.
`range(min, max)` de instance başına sabit rastgele aralık üretir.

`Points.count` instance sayısıdır. Tek dummy vertex + `count`
ile `instanceIndex` 0..N-1 olur. Tampon xyz taşımaz;
konum tamamen `positionNode` içindedir.

WebGPU nokta primitive’i 1px. `sizeNode` WebGL fallback’te
daha görünür. Dağılım yine GPU’dadır.

## Kod

`PointsNodeMaterial.positionNode = Fn(() => vec3(...))()`
`colorNode` ve `sizeNode` aynı `instanceIndex` ile değişir.
JS `update` içinde dizi yok — sadece `controls.update()`.

## Deney

1. `sin` yerine `cos`. Yörünge nasıl döner?
2. `n1.mul(6)` → `mul(12)`. Hacim neden büyür?
3. `sizeNode` çarpanını 2 → 14. Backend WebGPU ise fark az.

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `drawCalls` hâlâ ~1
- `points` = adet
- Performance: CPU frame düşük kalmalı (JS döngüsü yok)

## Mini görev

`positionNode` içine `hash` ile bir yörünge yarıçapı ekle.
Noktalar merkeze dairesel dönsün (`sin`/`cos` + `time`).

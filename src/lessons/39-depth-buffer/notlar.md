# Ders 39 — Depth Buffer

## Konu

**Depth buffer** (derinlik tamponu) her pikselin kameraya
uzaklığını 0..1 saklar. 0 ≈ **near** düzlemi, 1 ≈ **far**.

Neden? GPU “önde mi arkada mı” kararını renk değil depth
ile verir. Post’ta sis, odak, AO hep bu 0..1’i okur.

Gerçek projede: soft particles, decal, contact shadow.

## Mantık

```
pass(scene, camera)
  → renk dokusu + depth dokusu
getDepthNode() / getLinearDepthNode()
  → gri ekran: yakın açık, uzak koyu (linear)
```

Ham perspective depth çoğu pikseli 1’e yığar. Linear 0..1
near/far değişimini okunaklı gösterir.

Near’ı büyüt: yakındaki küre kesilir (clip).
Far’ı küçült: uzak küre solar / kesilir; gri aralık sıkışır.

## Kod

`pipeline.outputNode = vec4(d, d, d, 1)` — renk yok, sadece
depth. Slider `camera.near` / `camera.far` +
`updateProjectionMatrix()`.

## Deney

1. Near 0.1 → 2. Yakın küre neden kaybolur?
2. Far 24 → 8. Uzak küre gri skalada nereye gider?
3. Orbit ile küreleri hizala. Hangisi daha açık gri?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `textures` depth hedefi içerir
- Renk draw call’ları hâlâ olur; sen output’ta depth okursun
- `chrome://gpu`

## Mini görev

Depth’i `oneMinus` ile ters çevir. Yakın koyu, uzak açık
olsun. Hangisi “sis haritası” gibi durur?

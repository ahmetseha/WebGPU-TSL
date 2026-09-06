# Ders 40 — Depth Effects

## Konu

Depth bir **maske**. 0..1 ile rengi karıştırırsan sis,
palet veya kaba odak (focus) üretirsin.

Neden? Sahneye `Fog` koymak yerine post’ta kontrol
edebilirsin: aynı depth, üç farklı look.

Gerçek projede: atmospheric fog, heat haze, DIY DoF.

## Mantık

```
sis:   mix(sahne, sisRengi, depth)
renk:  mix(mavi, kırmızı, depth)
odak:  keskin ↔ 5 örnek ortalama
       t = saturate(|depth - focus| * 4)
```

Odak **gerçek Gaussian değil**. UV’yi kaydırıp 5 kez
örneklemek ucuz “blur-ish”. Focus uniform’una uzak piksel
daha çok bulanır.

## Kod

Aynı `pass` + `getDepthNode`/`getLinearDepthNode`.
Buton `outputNode` değiştirir. Odak slider’ı uniform.

## Deney

1. Sis: uzak küre neden gökyüzüne gömülür?
2. Depth renk: hangisi kırmızı — neden o?
3. Odak 0 → 1. Keskin düzlem neden kayar?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- Odak 5 texture sample: fragment maliyeti artar, draw call
  değil
- Performance GPU bound olabilir
- `window.__egitim.backend()`

## Mini görev

Sis rengini uniform yap. Slider ile turuncu alacakaranlık
sisi dene. Depth hâlâ aynı maske.

# Ders 32 — Galaxy

## Konu

Galaksi = rastgele saçılmış noktalar değil. **Yarıçap**,
**kol sayısı** ve **burgu** (spin) bir spiral üretir.

Neden? Procedural dağılım doku/model istemez. Aynı formül
yıldız alanı, büyü, portal halkası olur.

Gerçek projede: menü arka planı, uzay sahnesi, VFX disk.

## Mantık

```
u = hash(i)          → 0..1
r = u * u * R        → merkezde daha sık (radial)
kol = floor(u * N)
açı = kol * (2π/N) + r * burgu + sapma
x = cos(açı) * r
z = sin(açı) * r
renk = mix(sıcak, soğuk, r)
```

`r * r` merkeze yığar. `r * burgu` dış halkayı döndürür —
bu spiralin kendisidir. Sapma kolu kalınlaştırır.

İç renk sıcak (çekirdek), dış soğuk (disk). `sizeNode`
hash ile hafif çeşitlenir.

## Kod

`kolSayisi`, `burgu`, `boyut` **uniform**. Slider sadece
JS sayı yazar; geometri yeniden kurulmaz. Konum tamamen
`positionNode` + `instanceIndex`.

## Deney

1. Kol 2 → 8. Kollar neden çoğalır, nokta sayısı aynı mı?
2. Burgu 0. Neden çubuk galaksi olur?
3. `r * r` yerine `r` yazmayı dene (mini görevden önce
   tahmin et: merkez seyrelir).

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `drawCalls` ≈ 1, `points` = 9000
- Uniform değişince draw call artmaz
- `chrome://gpu`

## Mini görev

Zaman ekle: `açı + time * 0.05`. Disk yavaş dönsün.
Dönüş hızını ayrı uniform yap.

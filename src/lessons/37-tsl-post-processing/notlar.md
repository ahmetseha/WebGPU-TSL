# Ders 37 — TSL Post-processing

## Konu

Sahne bir doku olduktan sonra fragment TSL ile
**ekran uzayında** oynarsın. Model vertex’ine dokunmazsın.

Neden? Aynı bloom/vignette her objeye ayrı materyal yazmaktan
ucuzdur. Bir quad, bir shader.

Gerçek projede: lut, chromatic aberration, film grain.

## Mantık

```
scenePass.getTextureNode()  → RGB(A) ekran
uv()                        → 0..1 ekran
texture(doku, uv + ofset)   → komşu piksel
```

- **Grayscale** — luminance 0.299/0.587/0.114
- **Tint** — kanal çarpımı
- **RGB shift** — R/G/B üç ayrı UV örneği
- **Vignette** — merkeze uzaklık
- **Noise** — `mx_noise_float(uv * scale + time)`
- **Scanline** — `sin(uv.y * N)`

Hepsi `outputNode`. `needsUpdate = true` şart; aksi halde
eski graph kalır.

## Kod

Butonlar aynı `pass` üzerinde efekt değiştirir. Runner
yalnız `pipeline.render()` çağırır.

## Deney

1. RGB shift `k` 0.01 → 0.05. Kenarlar neden ayrışır?
2. Noise scale 380 → 40. Neden “kırçıl”dan “leke”ye döner?
3. Scanline 880 → 80. TV çizgisi neden kalınlaşır?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- Efekt değiştirince `drawCalls` sıçramamalı
- `textures` pass hedefi kadar
- Console: shader hata varsa TSL derlemesi orada

## Mini görev

RGB shift miktarını uniform + slider yap. Üç örnek UV’si
aynı `kayma` değerini kullansın.

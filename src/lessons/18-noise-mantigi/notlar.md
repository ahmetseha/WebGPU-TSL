# Ders 18 — Noise mantığı

## Konu

**Noise** — rastgele gibi görünen ama komşu pikselleri tutarlı olan alandır. Karıncalı `hash` ile yumuşak Perlin aynı şey değildir.

Neden kullanılır? Doğada keskin grid yoktur. Bulut, arazi, pas, mermer “kontrollü rastgele” ister.

Gerçek projede terrain, dissolve, rüzgâr ve procedural UV hep noise’a yaslanır. İspat yok; gözünle ayır.

## Mantık

```
hash(seed)          her piksel bağımsız 0..1    → TV karıncaları
value noise         hücre köşesi rastgele, arası yumuşar
gradient / Perlin   hücrede yön (gradient), daha doğal damar
```

`hash(uv)` float tohum ister. `uv.x * 900 + uv.y * 470` komşu pikseli farklı seed yapar. Sonuç **white noise**: yakın pikselin haberi yoktur.

`mx_noise_float` MaterialX Perlin’dir (gradient noise). Ölçek 4: koca lekeler, value-noise’a benzer okunur. Ölçek 20: ince damar, “Perlin detayı”.

## Kod

`mx_noise_float(uv * ölçek, 0.5, 0.5)` → `n * 0.5 + 0.5`. Perlin kabaca `-1..1` üretir; ekranda `0..1` griye çekilir.

Butonlar `mod` ve `olcek` uniform’unu yazar. Slider ile ölçeği kendin de gez.

## Deney

1. **hash rastgele**. Yakınlaş. Neden “bulut” oluşmaz?
2. Ölçek 4 → 20. Lekeler neden küçülür? Fonksiyon mu değişti, frekans mı?
3. Ölçek `1`. Neden neredeyse düz gri? Gradient çok yavaş mı değişiyor?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — bitmap yok. Noise fragment’ta doğar.
- `drawCalls` — tek plane. Üç buton yeni mesh eklemez.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

`hash` tohumuna `floor(uv * 8)` koy. Kare kare rastgele hücre görürsün. Bu neden value noise’un “köşe rastgeleliği”ne benzer, henüz yumuşatma yoktur?

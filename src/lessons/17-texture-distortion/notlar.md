# Ders 17 — Texture distortion

## Konu

**Texture distortion** — dokuyu değil, onu okuduğun UV’yi eğmektir. Su, ısı dalgası, bayrak baskısı hep aynı fikir: `texture(map, uv + offset)`.

Neden kullanılır? Bitmap’i her kare yeniden çizmezsin. GPU sadece adresi kaydırır.

Gerçek projede su yüzeyi, cam ardı bozulma, heat haze ve büyülü portal bu tekniği kullanır.

## Mantık

```
uv
  → sin(uv.y * freq + time) * amp     yatay dalga
  → + mx_noise_float(uv + time) * n   düzensiz titreme
  → texture(map, bozukUv)
```

Doku aynı kalır. Kırmızı daire “eriyorsa” texel değişmedi; piksel başka UV’den okuyor.

`sin` düzenli su / bayrak verir. `mx_noise_float` ısı ve sıvı gürültüsü ekler. İkisini toplamak doğal durur.

## Kod

`shaderDuzlem` tam ekran plane. Slider’lar `uniform`: JavaScript `freq.value` yazar, GPU her fragment’ta yeni offset hesaplar.

`vec2(dalga + noise, 0)` sadece X’i kaydırır. Y’ye de eklersen mercek / heat hissi artar.

## Deney

1. Genlik `0`. Daire neden tekrar yuvarlak? Offset sıfır mı oldu?
2. Frekans `4` → `20`. Dalgalar sıklaşır. Texture çözünürlüğü mü değişti?
3. Gürültü `0` → `0.3`. Sin dalgası durur mu, yoksa üzerine mi biner?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — CanvasTexture hâlâ 1 (artı output). Distortion yeni doku üretmez.
- `triangles` — tek plane. UV matematiği draw call eklemez.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Offset’i `vec2(0, dalga)` yap. Dalga dikey olur. Daire neden yukarı-aşağı esner, sağa-sola değil?

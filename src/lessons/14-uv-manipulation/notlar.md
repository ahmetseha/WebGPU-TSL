# Ders 14 — UV manipülasyonu

## Konu

UV’yi **ölçekle, kaydır, döndür, zamanda yürüt** — texture veya desen mesh geometrisini bozmadan hareket eder.

Neden? Su, kayan şerit, tile, radar. Geometri aynı, sample noktası değişir.

Gerçek projede atlas offset, triplanar, scroll hepsi bu dört işlem.

## Mantık

```
uv
  + (time * speed, 0)     scroll
  + (offsetX, offsetY)
  - 0.5
  * scale
  * rot(cos, sin)         merkezde dönüş
  + 0.5
  → damalı floor(uv*8)
```

Dönüş merkeze göre: önce 0.5 çıkar, 2D döndür, geri koy. Ölçek merkezden büyütür. Scroll U ekseninde.

## Kod

`q = (uv + scroll + offset - 0.5) * scale`. `vec2(q.x*c - q.y*s, q.x*s + q.y*c) + 0.5`. Damalı `mod(floor.x+floor.y, 2)` dönüşü görünür kılar.

## Deney

1. Kaydırma `0`. Damalar donar. Tahmin et, sonra aç.
2. Ölçek `0.2` vs `8`. Neden “zoom”?
3. Dönüş π/2. Damalar 45° değil 90° — neden kare ızgara?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Beş uniform, tek draw
- `chrome://gpu`
- `navigator.gpu`
- FPS kaydırma ile düşmemeli — maliyet aynı fragment

## Mini görev

Scroll’u `vec2(time, time)` yap (çapraz). Offset Y ile aynı mı? Değilse neden `time` her kare artar, offset sabit?

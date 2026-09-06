# Ders 16 — Texture sampling

## Konu

**Texture sampling** — GPU’nun bir bitmap’i UV koordinatıyla okumasıdır. `texture(map, uv())` o pikselin `vec4` rengini (RGBA) döner.

Neden kullanılır? Procedural desen her şeyi üretemez. Logo, fotoğraf, pürüz, maske dosyadan (veya canvas’tan) gelir.

Gerçek projede albedo, opacity mask, UI atlas ve video dokusu sampling ile okunur.

## Mantık

```
CPU: CanvasTexture (piksel buffer)
  → GPU texture
Fragment
  → uv()  (0..1)
  → texture(map, uv)
  → colorNode / opacityNode
```

- **UV** — yüzeyin 2D adresi. `(0,0)` sol alt, `(1,1)` sağ üst (Three.js).
- **Sampling** — o adresteki texel’i okumak.
- **Alpha** — `vec4`’ün `.a` kanalı. Saydamlık veya maske olabilir.
- **Mask** — tek kanalı `opacityNode` yapmak. Siyah delik açar.

Bu derste dosya indirmiyoruz. `CanvasTexture` damalı + kırmızı daire + sağ yarıda düşük alpha üretir.

## Kod

`texture(doku, uv().mul(tekrar))` UV’yi büyüterek `RepeatWrapping` ile tekrarı gösterir.

- **Renk** — `ornek.rgb`
- **Alpha** — `ornek.a`’yı griye yaz. Kanalı gör.
- **Maske** — renk durur, `opacityNode = ornek.a`. Arkadaki şeritler delikten görünür.

## Deney

1. Tekrar `1` → `4`. Kareler neden küçülür? Texture mi değişti, UV mi?
2. **Alpha**. Sağ yarı neden daha koyu gri? Canvas’ta `globalAlpha` ne yaptı?
3. **Maske**. Şerit zemin neden sadece sağda ve dairenin dışında görünür?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `memory.textures` — CanvasTexture + renderer çıktısı. 0 olmaz.
- `drawCalls` — zemin plane + örnek plane + output pass.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

UV’yi `uv().add(vec2(0.25, 0))` yap. Daire neden yana kayar? `RepeatWrapping` ile sol kenardan ne çıkar?

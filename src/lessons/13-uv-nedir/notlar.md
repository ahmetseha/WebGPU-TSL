# Ders 13 — UV nedir?

## Konu

**UV**, mesh yüzeyine yapışık 2D koordinattır. Düzlemde genelde sol-alt `(0,0)`, sağ-üst `(1,1)`. Texture bu kağıda basılır: `texture(harita, uv)`.

Neden debug `vec3(u, v, 0)`? Kırmızı = U, yeşil = V, mavi yok. Bozuk unwrap hemen görünür.

Gerçek projede her `Plane` / `Box` / `glTF` UV taşır. Shader’da `uv()` default kanal 0.

## Mantık

```
Geometry attribute: uv
  vertex shader → vary
  fragment: uv()  (0–1, üçgen içinde interpolasyon)
  texture(sample) veya procedural (bu eğitim)
```

U yatay, V dikey. Three düzleminde V çoğu zaman aşağı→yukarı 0→1. Texture wrap: 0–1 dışı `Repeat` / `Clamp`.

## Kod

`colorNode = vec3(uv().x, uv().y, 0)`. “Yalnız U” gri merdiven — tek kanal. Texture henüz yok; ilişki: aynı `uv()` sample noktası olur.

## Deney

1. Sol-alt hangi renk? `(0,0,0)` siyah mı? Tahmin et.
2. Sağ-üst sarı (`1,1,0`) olmalı. Orbit ile bak.
3. Texture olsa aynı köşeye hangi texel düşer?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `textures` HUD hâlâ 0 — procedural
- `chrome://gpu`
- `navigator.gpu`
- UV attribute CPU buffer; fragment’te interpolasyon

## Mini görev

`vec3(uv().x, 0, uv().y)` yaz. Yeşil kaybolur, mavi V olur. Texture’ı sonra bu UV ile bağla (ileriki ders).

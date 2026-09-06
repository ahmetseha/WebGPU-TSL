# Ders 9 — Swizzling

## Konu

**Swizzle**, vektör kanallarını harf ile seçmek / sıralamaktır: `.x .y .z .w` veya `.r .g .b .a`. `.xy`, `.xyz`, `.rgb` alt vektör üretir. `.yx` kanalları **takas** eder.

Neden? UV çevir, normal’in Y’sini maske yap, `vec3(v.xy, 0)` ile 2D’yi 3D’ye şişir.

Gerçek projede her TSL node’unda `.x` bir `float` node’dur.

## Mantık

```
uv (vec2)
  .x     → yatay 0–1  (kırmızı/gri)
  .y     → dikey 0–1
  .yx    → vec2 renk: R=V, G=U  (eksen takası)
positionLocal.y → mesh yüksekliği, UV değil
```

`.rgb` = `.xyz`. `w` / `a` dördüncü kanal (opaklık). Olmayan kanalı okuma.

## Kod

`vec3(uv.x)` yayılım. `vec3(uv.y, uv.x, 0)` = `uv.yx` renk. `positionLocal.y * 0.5 + 0.5` düzlemde -1…1 → 0…1.

## Deney

1. `uv.x` vs `uv.y`. Gradient yönünü tahmin et.
2. `uv.yx`: kırmızı artık yukarı mı artar?
3. `positionLocal.y` ile `uv.y` aynı mı? Orbit ile bak — biri mesh uzayı.

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Swizzle derleme hatası: `vec2` üzerinde `.z`
- `chrome://gpu`
- `navigator.gpu`
- Spector.js WebGPU’da yok

## Mini görev

`vec3(uv.xxx)` benzeri `vec3(uv.x, uv.x, uv.y)` yaz. Üçüncü kanal V olsun. Köşe renkleri ne olur?

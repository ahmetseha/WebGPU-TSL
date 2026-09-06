# Ders 7 — TSL veri tipleri

## Konu

GPU skaler ve vektörle konuşur: `float`, `int`, `bool`, `vec2`, `vec3`, `vec4`, `color`, `mat3`, `mat4`.

Neden? Yanlış tip derlemeyi kırar veya swizzle’ı saçmalaştırır. `uv` vec2, konum vec3, RGBA vec4.

Gerçek projede her uniform ve her node’un tipi vardır. Sol düzlem tipi gösterir; sağ küp `vec3` local konum boyar.

## Mantık

```
float  → tek kanal (gri)
vec2   → RG, B=0          (UV)
vec3   → RGB
vec4   → RGBA (a: opacity / clip)
color  → 0–1 RGB, renk uzayı ipucu
mat3/4 → döndür, ölçek, projeksiyon
int    → indeks, sayaç
bool   → select / adım
```

`vec3(uv.x, uv.y, 0)` vec2’yi renk olarak **debug** eder. Küp: `positionLocal * 0.5 + 0.5` — her eksen bir kanal.

## Kod

Düzlem `mix` ile float → vec2 → vec3. Küp `colorNode = positionLocal.mul(0.5).add(0.5)`. `int` / `bool` / matrisler burada görünmez; shader içinde yaşar.

## Deney

1. `float`: neden yalnızca gri merdiven?
2. `vec2`: yeşil (V) yukarıda mı? Tahmin et.
3. Küpü döndür. Renkler mesh’e yapışık — hangi tip, hangi uzay?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Tip hatası konsolda TSL / WGSL mesajı olur
- `chrome://gpu`
- `navigator.gpu`
- İki mesh ≈ iki draw; tip butonu draw artırmaz

## Mini görev

Düzleme `vec4(uv.x, uv.y, 0, uv.x)` verip `opacityNode`’u `.w` yap. Solda neden şeffaflaşır?

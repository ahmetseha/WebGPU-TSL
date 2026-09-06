# Ders 4 — Shader nedir?

## Konu

**Shader**, GPU’da her vertex veya her piksel için aynı anda çalışan küçük programdır. CPU tek tek boyamaz; GPU binlerce çekirdekte **aynı kodu** koşturur.

Neden? 2 milyon piksel × 60 FPS. Döngü JS’te patlar.

Gerçek projede malzeme, post-process, parçacık, compute — hepsi shader. Bu derste GLSL yazılmaz. **TSL** node grafiği WGSL (WebGPU) veya GLSL (WebGL yedek) üretir.

## Mantık

```
Vertex shader   — her köşe: konum, UV, normal
     ↓ interpolasyon (varying)
Fragment shader — her piksel adayı: renk
     ↓
Framebuffer
```

Kürede UV köşelerde set, üçgen içinde **karışır**. `positionNode` vertex’te çalışır: `sin(time) * normal` hafif nabız. `colorNode` fragment’te UV’den renk üretir.

Paralel çünkü bir piksel diğerini beklemez (genelde).

## Kod

`MeshBasicNodeMaterial.colorNode = vec3(uv.x, uv.y, 0.4)` fragment. `positionNode = positionLocal + normal * sin(time)` vertex. TSL derler; sen WGSL görmezsin.

## Deney

1. Nabız `0`. Renk değişir mi? Hangi aşama durdu?
2. Küre döndür (orbit). UV renk mesh’e yapışık mı?
3. Segment az olsa (düşün): interpolasyon daha kaba mı görünür?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- WebGPU’da Spector.js yok — TSL → WGSL içeride
- `chrome://gpu`
- `navigator.gpu`
- Fragment maliyeti `triangles` ile değil **piksel alanı** ile artar

## Mini görev

`colorNode`’u `normalLocal * 0.5 + 0.5` yap. UV kaybolur, yön renklenir. Vertex verisi fragment’e nasıl ulaştı?

# Ders 34 — InstancedMesh

## Konu

**Instancing** — aynı geometri ve materyali N kez, N matris
ile **tek draw call**da çizmek.

Neden 2000 ayrı `Mesh` felaket? Her mesh ≈ 1 draw call.
CPU her çağrıda state bağlar. 2000 kutu basit olsa bile
CPU boğulur. `InstancedMesh` GPU’ya “bu kutuyu 2000 kez,
şu matrislerle” der.

Gerçek projede: orman, şehir penceresi, asteroid, kalabalık.

## Mantık

```
1 BoxGeometry + 1 Material
  → InstancedMesh.count = N
  → setMatrixAt(i, Matrix4)
GPU: 1 draw, instanceIndex 0..N-1
```

`compose(position, quaternion, scale)` 4×4 matris üretir.
`instanceMatrix.needsUpdate = true` tamponu yükler.

HUD: instance modunda `drawCalls` küçük kalır.
**2000 ayrı Mesh** açınca `drawCalls` N’e tırmanır.

## Kod

`new InstancedMesh(geo, mat, 2000)` azami yeri ayırır.
Slider sadece `.count` keser — tampon yeniden kurulmaz.
Ayrı mod her kutu için yeni `Mesh` + yeni materyal açar.

## Deney

1. Adet 50 → 2000, instance mod. `drawCalls` değişir mi?
2. **2000 ayrı Mesh** aç. FPS ve `drawCalls`?
3. Ayrı modda adeti düşür. Neden hâlâ pahalı hissedilir?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `render.drawCalls` — instance ≈ 1, ayrı ≈ adet
- `render.triangles` — her iki modda da benzer olabilir
- Performance: CPU bound ayrı meshtedir, GPU triangle değil

## Mini görev

`setColorAt(i, color)` ile merkeze yakın kutuları mavi,
kenardakileri turuncu yap. `instanceColor.needsUpdate`.

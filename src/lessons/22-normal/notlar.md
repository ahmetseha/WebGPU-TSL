# Ders 22 — Normal

## Konu

**Normal** — yüzeyin “dışarı” bakan birim vektörüdür. Işık `dot(N, L)` ile parlaklığı bulur.

Vertex’i `positionNode` ile oynatınca buffer’daki normal **eski yüzeyde** kalır. Siluet dalgalı, speküler hâlâ pürüzsüz küre gibi — ışık yalan söyler.

Neden önemli? Displacement’tan sonra normal güncellemezsen ıslak / bozuk gölge alırsın.

Gerçek projede ocean, tessellation, normal map ve baked normal hep bu vektörü taşır.

## Mantık

```
sol:  p' = p + N * sin(x*f+t)*amp     normalNode yok
      lighting ← geometry normal (küre)
sağ:  aynı p'                         normalNode ≈ Nview + (cos*amp*f, 0, 0)
```

Analitik fikir: yükseklik `h = amp*sin(freq*x+t)` ise `dh/dx = amp*freq*cos(...)`. Normal’e bu eğimi eklemek birinci mertebe yaklaşımdır. Mükemmel değil; sol/sağ farkı öğretir.

`normalView` renk = vektörü RGB gör. Sol küre “düz boya” gibi kalır, sağda dalga çizgileri yürür.

## Kod

İki `MeshStandardNodeMaterial`, aynı `pos`, tek directional + ambient. Sol kırmızımsı (kırık), sağ yeşilimsi (yaklaşık).

Genlik 0 yap: ikisi de özdeş küre. Problem displacement’tan doğar.

## Deney

1. Orbit ile ışığın etrafında dön. Sol neden “plastik yumurta”, sağ neden oluklu?
2. **normalView renk**. Sol neden sakin gradient, sağ neden çizgili?
3. Genlik `0`. Fark neden biter? Normal mi düzeldi, yoksa yer değişimi mi yok oldu?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 2 küre + output. Normal düzeltmesi ekstra draw değildir.
- `triangles` — iki yüksek segment küre.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Sağ kürede `normalNode`’u kapat (yorumla). Işık neden hemen sola benzer? “Şekil doğru, gölge yanlış” cümlesini kendi gözünle doğrula.

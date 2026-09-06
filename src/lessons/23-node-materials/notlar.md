# Ders 23 — Node materials

## Konu

Üç kardeş, aynı `colorNode`:

- **MeshBasicNodeMaterial** — unlit. Işık yok sayılır. UI, debug, emissive poster.
- **MeshStandardNodeMaterial** — metal/roughness PBR. Günlük 3D nesne.
- **MeshPhysicalNodeMaterial** — Standard + clearcoat, transmission, sheen…

Neden kullanılır? “Aynı TSL rengi” ışık modeline göre farklı yaşar. Yanlış sınıf: ya düz boya ya gereksiz pahalı cam.

Gerçek projede product shot Physical (lake), karakter Standard, HUD Basic.

## Mantık

```
aynı albedo
  Basic     → fragment = colorNode
  Standard  → BRDF(N, L, V, roughness, metalness)
  Physical  → BRDF + clearcoat katmanı
```

Işığı kapat: Standard ve Physical kararır (ambient kalırsa hafif kalır), Basic aynı kalır. Bu, unlit tanımıdır.

Clearcoat: araba cilası gibi ikinci speküler. Sağ küre daha “ıslak cam”.

## Kod

Üç mesh **aynı** `SphereGeometry` instance. Draw call hâlâ 3 — geometry paylaşmak draw’ı birleştirmez, sadece RAM kazandırır.

`clearcoat` constructor `Record<string, unknown>` ile gidiyor; tip dosyasında alan yok, `setValues` runtime’da yazar.

## Deney

1. **Işık açık** kapat. Hangisi rengini korur? Neden?
2. Orbit. Physical’da highlight neden Standard’dan keskin?
3. `renderer.info.memory.geometries` — 1 mi 3 mü? Paylaşım HUD’da görünür mü?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 3 küre + output. Material türü call sayısını değiştirmez.
- `memory.geometries` — paylaşılan geo. 3 bekliyorsan şaşırma; 1 doğru olabilir.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Ortadaki Standard’ın `metalness` değerini `0.9`, `roughness` `0.1` yap. Neden neredeyse ayna olur, Basic neden asla olmaz?

# Ders 20 — Position nodes

## Konu

**positionLocal** — geometrinin kendi uzayındaki vertex konumudur. `positionNode` bunu GPU’da değiştirir. JavaScript’te `mesh.position` dünyayı taşır; TSL her **vertex**’i büker.

Neden kullanılır? Dalga, nefes, şişme, arazi — binlerce vertex’i CPU’da yazmak yavaştır.

Gerçek projede ocean, kumaş, blob ve stylized karakter TSL `positionNode` ile yaşar.

## Mantık

```
Geometry buffer (CPU'da bir kez)
  → her vertex: positionLocal
  → positionNode = positionLocal + (0, sin(x)*offset, 0)
  → model / view / clip
  → üçgen
```

Offset `0` = orijinal küre. Offset artınca X’e bağlı sin Y’ye eklenir. Segment 64×48 olmasa dalga “kırılır”: vertex yoksa yer değiştirmez.

Renk debug’u `positionLocal * 0.5 + 0.5` — XYZ’yi RGB görürsün. Şekil bozulsa bile renk **orijinal** local’dir; debug, deformasyondan önce okur.

## Kod

`MeshStandardNodeMaterial` + `temelIsik`: yer değişince ışık hâlâ eski **normal** ile hesaplanır. Kırık gölge Ders 22’nin konusu.

`SphereGeometry(1, 64, 48)` kasıtlı kalabalık. Az segmentle aynı shader “düşük poly dalga” olur.

## Deney

1. Offset `0` (positionLocal). HUD `triangles` neden değişmez? Vertex sayısı mı, konum mu?
2. Offset `0.4`. Siluet neden elips gibi ezilir? Hangi eksen sin ile gidiyor?
3. **positionLocal renk**. Kırmızı/yeşil/mavi hangi eksen? Deformasyon rengi neden yerinde kalır?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `triangles` — yüksek segment. Offset draw call eklemez.
- `drawCalls` — 1 mesh + ışık yok (ışık draw değildir) + output.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Offset’i `normalLocal * sin(x)` yönünde ekle. Şişen küre ile Y-only dalga farkı nedir? Normal neden “dışarı” iter?

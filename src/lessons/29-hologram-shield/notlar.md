# Ders 29 — Hologram kalkan

## Konu

Enerji kalkanı dört fikrin çarpımıdır: **Fresnel** (kenar), **animated noise** (leke), **opacity** (cam), **emissive** (kendi parıltısı) + tarama çizgisi.

**Kesişim hissi** sahte bir depth test değildir: `fresnel * noise`. Kenar zaten parlak; noise onu delik delik yakar. Göz “yüzeyde çarpışma” okur.

Neden kullanılır? Sci-fi kalkan, force field, holo-küre — geometry olarak düz bir küre yeter.

## Mantık

```
V = normalize(camera - worldPos)
F = pow(1 - |N·V|, güç)
n = noise(positionLocal * ölçek + (0, time, 0))
tarama = ince yatay çizgi (fract(uv.y*42 - time))
alpha = (F * (n+0.28) + tarama*0.12) * yoğunluk
emissive = cyan * (F*n + tarama)
```

İçeride küçük ikosahedron: kalkanın “koruduğu” şey. `depthWrite false` çekirdeği silmez.

`positionLocal` noise dünya dönünce nesneyle döner. UV noise kabuğa yapışır; ikisi farklı his.

## Kod

Tek `MeshStandardNodeMaterial` kabuk. Slider’lar graph’ı canlı tutar, material rebuild yok.

Çekirdek JS’te yavaş döner; kalkan TSL’de titreşir. İki saat bilinçli ayrı.

## Deney

1. Fresnel güç `5`. Kalkan neden ince bir halkaya iner? Orta `F≈0` mu?
2. Noise ölçek `1` → `7`. Lekeler sıklaşır. Kesişim neden daha “kıvılcımlı”?
3. Yoğunluk `0`. Çekirdek kalır. Kalkan draw call’dan çıkar mı, yoksa alpha 0 mesh midir?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- Yoğunluk 0 olsa bile `drawCalls` düşmez: mesh görünür, alpha 0. `visible = false` call keser.
- `triangles` — 64×48 kabuk + ikosahedron.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

İç nesneye de zayıf bir Fresnel rim ekle. Kalkan ile çekirdek kenarı neden “çift halka” okunur? Hangisini emissive, hangisini albedo tutarsın?

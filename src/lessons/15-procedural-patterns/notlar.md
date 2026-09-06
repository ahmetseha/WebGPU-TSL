# Ders 15 — Yordamsal desenler

## Konu

**Yordamsal desen**, texture dosyası olmadan `uv` matematiğidir: gradyan, şerit, dama, daire, halka, ızgara, dalga, radyal.

Neden? Sonsuz çözünürlük, 0 texture belleği, parametreyle animasyon.

Gerçek projede UI, maske, toon gölge, zemin tile, VFX.

## Mantık

```
gradyan   mix(A,B,u)
şerit     step(0.5, fract(u*10))
dama      (floor(u*8).x + .y) % 2
daire     1 - dist(uv, 0.5)*2
halka     1 - |dist - r| * k
ızgara    fract hücrenin ince kenarı
dalga     sin(u*30 + v*8)
radyal    dist merkezden dışarı
```

Hepsi aynı düzlem, aynı draw. Buton `uMod` seçer.

## Kod

Kritikler: `fract` tekrar, `floor` hücre indeksi, `distance` yarıçap, `abs` halka kalınlığı, `step` eşik. Renk `mix(zemin, cyan, maske)`.

## Deney

1. Şerit: `10` yerine zihninde `2` koy. Kaç bant?
2. Dama vs ızgara. Biri dolu kare, biri çizgi — hangi fonksiyon farkı?
3. Halka: `0.35` yarıçap. Merkez neden koyu?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `textures: 0` kalmalı
- `chrome://gpu`
- `navigator.gpu`
- Sekiz desen tek fragment programında — maliyet neredeyse sabit

## Mini görev

`dama` ile `daire`’yi çarp. Damalı disk çıkar. Texture eklemeden ikinci bir `Fn` yaz.

# Ders 21 — Vertex displacement

## Konu

**Vertex displacement** — her kare her vertex’i TSL ile oynatmaktır. `sin` + `time` dalga/bayrak, `mx_noise_float` arazi, `normalLocal * sin` jel.

Neden kullanılır? Animasyonu CPU’da `geometry.attributes.position` yazarak yapmak 80×80 plane’de pahalıdır. GPU zaten o vertex’leri işler.

Gerçek projede bayrak, deniz, jello, procedural planet kabuğu.

## Mantık

```
yüksek segment geometri
  → positionLocal
  → dalga:   z += sin(x*freq + time)*amp
  → bayrak:  aynı, * (x+1)/2   serbest kenar daha çok sallanır
  → arazi:   z += noise(x, y, time)
  → jel:     p += normal * sin(time + |p|)
  → ışık (eski normal — hâlâ kaba)
```

Az segment = köşeli dalga. 80×80 kasıtlı. Jel kürede: radial nefes.

`Fn(() => sin(...))` aynı dalga ifadesini bayrakla paylaşır. Grafiği kopyalamazsın, yeniden kullanırsın.

## Kod

Plane XY’de durur, offset Z’ye gider (kameraya doğru). Jel ayrı küre + `normalLocal`.

`MeshStandardNodeMaterial` + `temelIsik`: yer değişir, gölge bazen “kayar”. Normal güncellemesi sonraki ders.

## Deney

1. Frekans `2` → `8`. Dalga sıklaşır. Segment yetmezse neden merdiven gibi kırılır?
2. **Bayrak**. Sol kenar neden neredeyse durur? `(x+1)/2` orada ~0 mı?
3. **Jel**. Işık neden “ıslak balon” gibi kayıyor? Normal güncellenmedi.

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `triangles` — 80×80 plane ≈ 12800 üçgen + output. Jel küre ayrı sayı.
- `drawCalls` — bir görünür mesh. İkisini birden açmıyoruz.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Bayrağa `mx_noise_float` ile küçük Z titremesi ekle. Sadece `sin` ile “kumaş” neden fazla düzenli kalır?

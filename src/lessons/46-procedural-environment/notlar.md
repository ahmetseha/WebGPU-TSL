# Ders 46 — Prosedürel ortam

## Konu

**Prosedürel ortam** — doku/model yığmak yerine fonksiyonla
dünya üretmek. Bu ders küçük bir tepe: arazi, çimen, kaya,
gökyüzü rengi, sis, rüzgar.

Neden? Tutarlı bir yer hissi, efekt çöplüğü değil. Aynı
yükseklik fonksiyonu hem vertex’e hem instance yerleşimine
gider; çimen havada asılı kalmaz.

Gerçek projede: stilize dünya, prototip seviye, arka plan.

## Mantık

```
araziY(x, z) = sin(x) * cos(z)
Plane (XY) → rotateX(-90°) → dünya XZ
displacement local Z = araziY  → dünya Y
```

Çimen / kaya: `InstancedMesh` + `setMatrixAt`.
Rüzgar: `sin(time + world.x)` yalnızca yaprak ucunda
(`positionLocal.y + 0.2`). Kök yerinde kalır.

Sis (`Fog`) uzak çimeni gökyüzüne eritir — derinlik ucuzdur.

## Kod

Tek `uniform` rüzgar. Çimen rengi `hash(instanceIndex)`.
Bir ağaç (silindir + koni) sahneye “yer” verir; 500 ağaç
değil. HUD: 1 arazi + 1 çimen + 1 kaya + 2 mesh ≈ az
draw call.

## Deney

1. Rüzgarı 0 yap. Neden dünya “kartpostal” olur?
2. `CIME` 520 → 80. drawCalls değişir mi? triangles?
3. Sis far’ını kıs. Neden ufuk keskinleşir?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().render.drawCalls
window.__egitim.info().render.triangles
```

- `compute.frameCalls` 0 — bu ders compute değil
- `chrome://gpu`
- Spector.js WebGPU’de yok

## Mini görev

İkinci bir ağaç türü ekleme. Aynı koni ölçeğini
`InstancedMesh` yap (12 adet). Draw call neden 1 artar,
12 değil?

# Ders 42 — WebGPU Compute

## Konu

**Compute shader** — GPU’da üçgen çizmeden çalışan genel
hesap. Vertex/fragment “görüntü üret”; compute “veri yaz”.

Neden? 12.000 parçacık konumunu CPU’da döngüyle güncellemek
kare bütçesini yer. GPU aynı anda binlerce iş parçacığı koşturur.

Gerçek projede: parçacık, kumaş, akışkan, GPU culling.

## Mantık

```
CPU: compute(node, adet) komutu
GPU: her instanceIndex bir parçacık
  → storage buffer (instancedArray)
  → positionNode = buffer.toAttribute()
  → Points çizimi
```

`renderer.info.compute.frameCalls` bu karedeki compute
geçişidir. `drawCalls` ayrıdır — önce hesap, sonra çizim.

WebGPU nokta primitive’i 1 pikseldir. Bulut görünür çünkü
adet yüksektir. Boyutlu tanecik için Sprite +
`PointsNodeMaterial` (sonraki dersler).

## Kod

`instancedArray(adet, "vec3")` GPU deposu. `Fn` içindeki
`element(instanceIndex)` o iş parçacığının hücresi.
`renderer.compute(init)` bir kez, `compute(update)` her kare.
`toAttribute()` depoyu vertex özelliğine bağlar.

WebGL backend’de compute yok — CPU dizi yedeği çalışır.

## Deney

1. Genlik kaydır. `sin(time)` çarpanı büyür; neden Y salınımı
   artar?
2. Sıfırla. Init compute (veya CPU doldurma) konumları başa
   alır. `frameCalls` o karede 2 olabilir.
3. HUD `points` ≈ 12000. `triangles` neden neredeyse 0?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
window.__egitim.backend()
```

- WebGPU: `compute.frameCalls` ≥ 1
- WebGL: 0 — compute yok
- `chrome://gpu` → WebGPU: Hardware accelerated
- Spector.js kullanma; WebGPU karesini yakalamaz

## Mini görev

Init’te X/Z’yi daireye diz (`sin` / `cos` + `hash` yarıçap).
Update aynı kalsın. Neden hâlâ tek compute + tek draw call?

# Ders 35 — TSL + Instances

## Konu

`setMatrixAt` taban pozisyonu verir. **TSL** her instance’ı
GPU’da ek olarak kıpırdatır ve boyar.

Neden? 1600 kutunun Y’sini JS’te `setMatrixAt` ile her kare
yazmak upload demektir. `sin(time + instanceIndex)` shader’da
kalır.

Gerçek projede: rüzgârda ot, nefes alan kalabalık, idle bob.

## Mantık

```
CPU: grid matrisleri (bir kez)
GPU vertex:
  positionLocal  ← instance matrisi uygulanmış yerel köşe
  + (0, sin(time + i * 0.13), 0)
  color = hash(i)
```

`instanceIndex` InstancedMesh’te 0..count-1.
`hash(instanceIndex)` her kopyaya sabit rastgele renk.
`positionLocal` köşe; offset instance’ı bütün olarak kaydırır
çünkü her köşeye aynı Y eklenir.

## Kod

`MeshStandardNodeMaterial.positionNode` ve `colorNode`.
Slider yine sadece `.count`. Dalga JS döngüsü istemez.

## Deney

1. `0.13` → `1.2`. Neden komşular senkron kaçar?
2. Offset’e X de ekle: `sin(time + i)` X’te.
3. `hash` renk kanallarını aynı yap. Neden gri olur?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `drawCalls` düşük kalır
- `triangles` = kutu üçgeni × count
- Performance: adet artsa da JS `update` kısa kalmalı

## Mini görev

`instanceIndex` ile ölçek: `positionLocal * (0.6 + hash)`.
Küçük/büyük kutular karışsın; matris scale’e dokunma.

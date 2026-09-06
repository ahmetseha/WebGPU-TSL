# Ders 28 — Kahve dumanı

## Konu

Küçük tutarlı bir sahne: silindir kupa, torus kenar, torus kulp, kahve diski, **duman plane**.

Duman bir mesh’tir; parçacık değildir. Noise + UV yukarı kaydır + kenar maskesi + `depthWrite false`.

Neden kullanılır? Stylized buhar ucuzdur. Binlerce particle şart değil.

Gerçek projede fincan, baca, tütsü, nefes — aynı plane kartı.

## Mantık

```
kupa (opak, depth yazılır)
duman plane
  uv' = uv + (noise*0.12, -time*hız)
  n   = noise(uv' * 4)
  mask = smoothstep kenar X ve Y
  alpha = n * mask * yoğunluk
  DoubleSide, transparent, depthWrite = false
  her kare lookAt(kamera)  billboard
```

`depthWrite false` dumanın kupayı “kesmesini” önler. Soft edge: UV 0/1’de alpha 0. Üstte `smoothstep(1, 0.32, y)` dumanı dağıtır.

Yatay noise offset düz kaymayı buruşturur — rüzgâr değil, ucuz domain warp.

## Kod

`kameraSifirla` hedefi `(0, 0.45, 0)` — fincan. Slider’lar sadece duman graph’ı.

Kulp tam torus; eğitim için yeterli siluet.

## Deney

1. Yoğunluk `0`. Kupa durur, duman neden yok olur? Alpha mı sıfır?
2. Hız `0`. Buhar neden donmuş fotoğraf? Scroll durdu, noise hâlâ var mı?
3. Orbit. Plane neden hep sana bakar? `lookAt` hangi ekseni ezer?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — kupa parçaları + kahve + duman + output. Parçacık yok.
- `memory.textures` — CanvasTexture yok; duman procedural.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Dumana ikinci bir oktav (`olçek * 2`) ekle. Tek oktav neden “hamur”, iki oktav neden “buhar teli” gibi durur?

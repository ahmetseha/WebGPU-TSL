# Ders 27 — Animated noise

## Konu

Durağan noise bir fotoğraftır. `noise(uv + time)` aynı alanı **kaydırır** veya 3. eksende yürür. Duman, su, enerji, lav aynı motorun paletleridir.

Neden kullanılır? Video texture loop’u yerine sonsuz, dikişsiz hareket.

Gerçek projede sis kartı, lava lamp, kalkan energy, su normal’i (ileride).

## Mantık

```
uv' = uv + (0, -time * hız)     yukarı kaydır (duman/su)
n    = mx_noise_float(uv' * ölçek)
n3   = mx_noise_vec3(uv, time)  domain warp / enerji damarı
```

- **Duman** — gri n, UV yukarı.
- **Su** — iki oktav, mavi-cyan `smoothstep`.
- **Enerji** — `mx_noise_vec3` kanalları, parlak damar.
- **Lav** — koyu taban + turuncu + sarı sıcak eşik.

Hız 0 = durdurulmuş procedural. Ölçek = zoom, hız değil.

## Kod

`shaderDuzlem` — sadece fullscreen plane. Buton `mod` uniform.

`n.add(n2 * 0.35)` kaba FBM (iki katman). Gerçek fBm daha çok oktav ister; göz için yeter.

## Deney

1. Hız `0`. Desen neden fotoğraf olur? `time` çarpanı mı öldü?
2. Ölçek `2` → `10`. Hareket neden “daha sinirli” görünür? Aynı hız, daha sık tepe.
3. **Enerji** vs **Lav**. Aynı `n` ailesi, neden biri damar biri magama? Palet + eşik.

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- Bitmap yok. `memory.textures` yine output pass yüzünden 0 olmayabilir.
- `mx_noise_vec3` fragment’ı ağırlaştırır. Performance → frame ~16.7 ms hedef.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Suya `uv + vec2(n * 0.08, 0)` ile domain warp ekle. Dalgalar neden düz kaymak yerine buruşur?

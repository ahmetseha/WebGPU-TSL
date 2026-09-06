# Ders 26 — Time

## Konu

**time** — TSL’nin saniye cinsinden akan uniform’u. JavaScript `Date.now` yazmana gerek yok; Three.js her kare `frame.time` basar.

`sin(time)` `-1..1` yumuşak periyot üretir. Ölçek, renk ve konum aynı t’den beslenir.

Neden kullanılır? Procedural animasyon senkron kalır. Pause = `hız = 0`.

Gerçek projede nabız UI, idle bounce, neon flicker, shader tabanlı yürüyüş.

## Mantık

```
t = time * hız
sin(t) ∈ [-1, 1]
ölçek:  p' = p * (1 + 0.22*sin)
renk:   mix(mavi, sarı, sin*0.5+0.5)
konum:  p' = p + (0, 0.45*sin, 0)
```

Üç mesh, üç yorum. Aynı saat. Hız 0: donmuş kare. Hız 4: 4×.

`positionNode` ölçeği vertex’te yapar. `mesh.scale` set etmiyoruz — HUD’daki dünya matrisi 1 kalır, şekil yine nefes alır.

## Kod

`uniform(1)` hız. Slider `hiz.value`. `time` zaten GPU’da.

Orta kutu sadece `colorNode` değiştirir; draw ve triangle sabit.

## Deney

1. Hız `0`. Üçü de neden aynı anda donar? Ortak `t` mi?
2. Hız `3`. Renk döngüsü ile zıplama neden fazda? Aynı `sin(t)`?
3. Sağ halkayı izle. `mesh.position.y` JS’te 0 kalır. Hareket nerede?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — 3 mesh + output. Animasyon extra call değil.
- FPS / frame ms: hız artınca **shader maliyeti aynı** kalmalı. CPU loop yok.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Renk kutusuna `sin(t * 2)` ver. Neden 2× hızlı yanıp söner, zıplama aynı kalır? İki frekansı bilinçli ayırmak ne işe yarar?

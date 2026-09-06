# Ders 45 — Parçacık fiziği

## Konu

Basit parçacık fiziği beş kuvvetle kurulur:

- **Yerçekimi** — sabit ivme `(0, g, 0)`
- **Hız** — konumun türevi
- **Sürtünme** — `v *= 0.98` (sönüm)
- **Çekim** — fareye doğru
- **İtme** — aynı vektör, ters işaret

Neden GPU? Her tanecik aynı formül; `instanceIndex` yeter.
Fare `uniform vec3` — JS yazar, compute okur.

Gerçek projede: kıvılcım, sihir, UI parçacık, prototip fizik.

## Mantık

```
v += (0, g, 0)
v += normalize(fare - p) * güç / uzak * işaret
v *= sürtünme
p += v
yere değdiyse p.y = zemin, v.y *= -zıplama
```

İşaret `mix(1, -1, itme)` — dal kullanmadan çekim/itme.

Canvas `pointermove` NDC benzeri düzleme map eder.
OrbitControls ile çakışabilir; önce parçacığa bak.

## Kod

Tek compute, iki buffer. Zemin `step` + `mix`.
CPU yedekte aynı Euler, `Float32Array` + `needsUpdate`.

## Deney

1. Yerçekimini 0 yap. Neden “uzay tozu” olur?
2. İtme + yüksek fare gücü. Neden patlama gibi dağılır?
3. Sürtünme 0.99. Neden asla durmaz?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- İmleci hareket ettirirken `frameCalls` 1 kalır
  (uniform ucuz, yeni dispatch değil)
- `chrome://gpu`
- Spector.js kullanma

## Mini görev

Zıplama yerine yere yapış (`v.y = 0`). Sürtünmeyi yerde
daha yüksek yap. “Kar yığını” mı “cıvık çorba” mı olur?

## Tekrar

1. `uniform` ile `instancedArray` farkı nedir?
2. `compute.frameCalls` ile `drawCalls` neden ayrı?
3. Euler neden büyük `dt` ile patlar?

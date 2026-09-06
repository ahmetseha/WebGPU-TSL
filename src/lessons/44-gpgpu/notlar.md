# Ders 44 — GPGPU

## Konu

**GPGPU** (General-Purpose computing on GPU) — GPU’yu sadece
üçgen boyamak için değil, genel sayı için kullanmak.

Eski yol: konumu bir texture’a yazıp ping-pong yapmak.
WebGPU’de **storage buffer** (`instancedArray`) aynı işi
daha doğrudan yapar.

Neden? Binlerce parçacığın ivmesi birbirinden bağımsızdır.
GPU SIMD modeli buna uyar.

Gerçek projede: sürü, kumaş, soft body, GPU particles.

## Mantık

```
a = normalize(hedef - p) * çekim / uzaklık
v = (v + a) * sürtünme
p = p + v
```

Üç tampon:

- **position** — nerede
- **velocity** — bu karede nereye
- **acceleration** — kuvvetlerin toplamı

Euler integrasyonu: basit, ucuz, büyük adımda patlar.
Ders için yeterli.

Sarı küre hedef; imleç onu taşır. `uniform vec3` her kare
JS’den yazılır.

## Kod

`ivmeler.element(instanceIndex)` üçüncü depo. Compute
sadece sayıları yazar; `Points`/`Sprite` sonucu çizer.
Bu yüzden “görüntü shader’ı” ile “fizik shader’ı” ayrıdır.

## Deney

1. Çekimi artır. Neden yörünge sıkılaşır, sonra salınım?
2. İmleci hızlı gezdir. `uniform` gecikmesi var mı?
3. `compute.frameCalls` 1, `drawCalls` 2 (küre + parçacık).
   Neden 5000 draw call değil?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.info().compute.frameCalls
```

- `points` veya Sprite üçgenleri HUD’da görünür
- `chrome://gpu`
- Spector.js WebGPU compute tamponunu göstermez

## Mini görev

İkinci bir itici nokta ekle (`uniform`). `a`’ya ikinci
yönü çıkar. İki kutuplu bir alan görür müsün?

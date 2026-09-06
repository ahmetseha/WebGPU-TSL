# Ders 12 — Fn

## Konu

`Fn` yeniden kullanılabilir TSL fonksiyonudur. JS fonksiyonu gibi görünür; derleyicide **shader fonksiyonu / alt graph** olur. Kopyala-yapıştır node zinciri yerine isim verirsin.

Neden? Daire, dalga, gürültü maskesi birden fazla malzemede yaşar.

Gerçek projede `mx_noise_float`, toon, dissolve — hepsi `Fn` paketidir. Bu derste üçü karışır.

## Mantık

```
createCircle()      → 1 - dist(uv, 0.5)
createWave()        → sin(uv.y + time)
createNoiseMask()   → mx_noise_float(uv*5 + t)
        ↘     ↙
   daire * gürültü → maske
        mix(zemin, cyan, maske)
        + sarı * dalga
```

`Fn(() => { ... })` sonra `createCircle()` ile **çağır**. Çağırmazsan TSL uyarır.

## Kod

Üç `Fn`. `maske = createCircle() * mix(1, noise, uGurultu)`. `mix` zemin/cyan + `createWave()` sarı katkı. Slider’lar yalnızca uniform; `Fn` gövdesi aynı kalır.

## Deney

1. Daire kenarı neden yumuşak değil, `saturate` kesiyor? Tahmin et.
2. Dalga yatay bant — `uv.y` yüzünden. `uv.x` olsa?
3. Gürültü zamanla kayıyor. Hangi `Fn` `time` kullanıyor?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Tek düzlem, tek draw — üç Fn tek fragment
- `chrome://gpu`
- `navigator.gpu`
- Compute değil; `mx_noise` fragment’te

## Mini görev

`createCircle`’a merkez parametresi ver (`Fn(([m]) => ...)`). İki daire çağır, `max` ile birleştir. Neden `Fn` şart oldu?

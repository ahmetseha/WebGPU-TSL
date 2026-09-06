# Ders 33 — Explosion

## Konu

Patlama: her parçacık merkeze **ters yönde** kaçar.
Yön rastgele, uzunluk **yaş × hız**.

Neden GPU? 6000 yönü JS’te normalize etmek ucuz değil;
TSL’de `normalize(hash vektör)` her noktada bedava.

Gerçek projede: kıvılcım, hit burst, büyü dağılması.

## Mantık

```
yön = normalize(hash.xyz * 2 - 1)
konum = yön * yaş * hız
opaklık = 1 - yaş
```

`hash` 0..1 üretir. `* 2 - 1` → -1..1 küpü.
`normalize` küpü küre yüzeyine yayar — burst homojen olur.

Yaş CPU `uniform`. **Patlat** yaşı sıfırlar. GPU her kare
aynı formülü yeni yaş ile çözer. Dizi upload yok.

## Kod

`opacityNode = yaş.oneMinus()`. `AdditiveBlending` üst üste
binen noktaları parlatır. `depthWrite = false` sıralama
hatasını gizler.

## Deney

1. Hız slider. Neden erken solar / geç solar?
2. `normalize` kaldır. Küp köşeleri neden dolu kalır?
3. Yaş 2.4’te kilitlenir. Neden parçacık durur?

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `compute.frameCalls` 0 — bu render shader, compute değil
- `points` = 6000, `drawCalls` ≈ 1
- Performance: Patlat tıklayınca JS maliyeti artmamalı

## Mini görev

Yaşı `fract(time * hız + hash)` yap. Sürekli döngüsel
mikro patlamalar olsun. Sonra tekrar **Patlat** ile senkron
sıfırla.

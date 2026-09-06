# Ders 8 — TSL işlemleri

## Konu

TSL işlemleri liste ezberi değil: **görürsün**. Hepsi `uv.x` (0→1 soldan sağa) üzerinde.

Neden? Desen, maske, yumuşak kenar, titreşim — aynı beş fonksiyondan çıkar.

Gerçek projede `mix` renk, `smoothstep` antialias şerit, `step` eşik, `clamp` sınır, `sin` salınım.

## Mantık

```
uv.x
  mix(A,B,x)         → düz gradient
  smoothstep band    → yumuşak şerit (varsayılan)
  sin(x*24)          → dalga
  step(0.5, x)       → sert kesme
  clamp(2x-0.5,0,1)  → ortada sıkışmış gradient
```

`smoothstep(e0,e1,x)` e0–e1 arasında S-eğrisi. Bant: bir yükselen eksi bir yükselen.

## Kod

`bant = smoothstep(0.35,0.45,x) - smoothstep(0.55,0.65,x)`. Butonlar `uMod` seçer; shader yeniden yazılmaz.

## Deney

1. `step` ile `smoothstep` kenarı. Hangisi aliasing yapar?
2. `clamp`: solda neden düz renk? Tahmin et (`2x-0.5 < 0`).
3. `sin`: kaç tepe sayıyorsun? 24 / 2π ≈ ?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Buton `drawCalls` artırmaz — tek düzlem
- `chrome://gpu`
- `navigator.gpu`
- WebGPU’da Spector yok; işlemi gözünle doğrula

## Mini görev

`smoothstep` eşiklerini `0.1` ve `0.9` yap. Bant neden şişer? `sin(x*24)` yerine `sin(x*24)+sin(x*6)` dene.

# Ders 11 — Variable (toVar)

## Konu

TSL node’ları **değişmez**dir: `uv().mul(8)` yeni bir node üretir, eskisini yazmaz. `.toVar("ad")` shader’da **değişken** açar: ara sonucu isimlendirir, tekrar hesaplatmaz.

Neden? Uzun desenler okunur, derleyici aynı ifadeyi iki kez yazmaz.

Gerçek projede gürültü + maske + renk zincirinde her adım `toVar`. `assign` ise `Fn` içinde (sonraki ders).

## Mantık

```
uv            immutable
  * ölçek     yeni node → toVar("olcekli")
  fract       yeni node → toVar("hucre")
  x * y       yeni node → toVar("karisim")
  mix         renk
```

JS `const` ile karıştırma: JS referansı sabit, GPU tarafında `var` tekrar yazılabilir. Zincir burada yalnızca adlandırır.

`fract` kesir — 8 kez tekrarlardan hücre UV’si (0–1).

## Kod

`uv().mul(uOlcek).toVar("olcekli")` → `fract` → `hucre.x.mul(hucre.y).toVar("karisim")` → `mix`. Slider ölçeği değiştirir, graph aynı kalır.

## Deney

1. Ölçek `2` → `16`. Hücreler neden küçülür? Tahmin et.
2. Sol-alt köşe neden hep koyu? (`x*y` orada 0)
3. `toVar` silsen görüntü değişir mi? Okunurluk?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- `toVar` draw call eklemez
- `chrome://gpu`
- `navigator.gpu`
- WGSL’de isimler minify olabilir; sen TSL adını görürsün

## Mini görev

`hucre`’den sonra `length(hucre - 0.5).toVar("d")` ekle. `mix` t’si `d` olsun. Hücrelerde daire çıkar mı?

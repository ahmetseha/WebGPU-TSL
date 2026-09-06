# Ders 10 — Uniform

## Konu

**Uniform**, CPU’dan GPU’ya **kare boyunca sabit** giden değerdir: renk, hız, güç. Vertex her köşede, fragment her piksede **aynı** uniform’u okur.

Neden? Shader’ı her kare yeniden derlemezsin. Slider = `uniform.value`.

Gerçek projede zaman, fare, tema rengi, metalness — bind group’a paketlenir. Three + TSL bunu `uniform()` ile gizler.

## Mantık

```
JS:  renkDeger.set / uHiz.value = n
        ↓
Three: uniform node
        ↓
WebGPU: bind group + buffer
        ↓
Shader: her thread aynı değeri okur
```

`attribute` köşeden köşeye değişir. `uniform` çağrı boyunca değişmez. `time` Three’nin kendi uniform’u; `uHiz` onu ölçekler.

## Kod

`const uRenk = uniform(renkDeger)` — Color nesnesi referans. Slider `renkDeger.r/g/b` yazar. `colorNode = uRenk * uGuc * (sin(time*uHiz)*0.2+0.8)`.

## Deney

1. Hız `0`. Nabız durur, renk kalır. Hangi uniform dondu?
2. Güç `0`. Küre neden siyah? Tahmin et.
3. Renk slider: JS `Color` değişir, shader satırı değişmez. Neden?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Uniform güncellemesi yeni pipeline değildir
- `chrome://gpu`
- `navigator.gpu`
- WebGPU’da bind group Spector’da görünmez

## Mini görev

Dördüncü uniform `uKesim` ekle: `colorNode`’u `uKesim`’den küçükken karart. Slider eşiği JS’ten gelsin.

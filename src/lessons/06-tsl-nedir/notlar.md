# Ders 6 — TSL nedir?

## Konu

**TSL** (Three.js Shading Language) shader’ı JS/TS node grafiği olarak kurar. String GLSL yazmazsın. Graph derlenir: WebGPU’da **WGSL**, WebGL yedekte **GLSL**.

Neden? Tek kod, iki backend. Tip güvenliği, yeniden kullanım, `Fn`.

Gerçek projede `Mesh*NodeMaterial`, post-process, compute — hepsi TSL node.

## Mantık

```
colorA, colorB, uv().x
      ↘   mix   ↙
     colorNode
         ↓
  TSL compiler
         ↓
  WGSL veya GLSL
         ↓
  Pipeline (GPU)
```

`mix(A, B, t)` lineer karışım: t=0 → A, t=1 → B. `uv().x` soldan sağa 0→1. Slider `t`’ye ekler; graph aynı, yalnızca uniform değişir.

## Kod

`mix(color("#1a2230"), color("#3ec5f1"), uv().x + uKay)`. `shaderDuzlem` kamerayı ve çift yüzlü düzlemi kurar.

## Deney

1. Slider `0`. Solda hangi renk? Tahmin et, sonra bak.
2. `+0.5` kaydır. Gradient neden sağa kaçar?
3. Backend WebGL 2 olsa bu kod değişir mi?

## Browser DevTools

```js
window.__egitim.backend()
window.__egitim.info()
```

- Kaynak sekmesinde WGSL arama — Three derlemesi runtime’da
- `chrome://gpu`
- `navigator.gpu`
- Spector.js yalnızca WebGL yedekte; node graph’ı göstermez

## Mini görev

`mix` t’sini `uv().y` yap. Gradient yönü neden döner? `uv().x.mul(uv().y)` dene — köşeler ne olur?

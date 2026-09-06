# Ders 51 — WebGPU debug araçları

## Konu

**Spector.js** bir WebGL frame yakalayıcısıdır: draw call,
program, texture, buffer. Bu eğitim **WebGPURenderer**
kullanır. Spector.js WebGPU komut akışını **yakalamaz**.

Chrome’da 2026’da yerleşik “WebGPU” paneli yoktur. Eski
`chrome://flags` WebGPU satırlarını açma — gerekmez.

Ne kalır?

1. Console + `window.__egitim.info()`
2. `chrome://gpu` (Hardware accelerated?)
3. İsteğe bağlı eklenti: **WebGPU Inspector**
4. Backend WebGL2 ise o zaman Spector.js anlamlıdır

## Mantık

```
WebGL  → Spector.js / eski WebGL profiler
WebGPU → doğrulama mesajları + renderer.info + gpu sayfası
```

HUD `backend` satırına bak. “WebGPU” yazıyorsa Spector
boş döner; bu bir bug değil.

## Kod

Düğmeler backend’e göre farklı `console.info` basar.
Sahne sadece bakılacak bir torus — araç dersi.

## Deney

1. Backend yaz. `navigator.gpu` nesne mi, undefined mı?
2. chrome://gpu aç. WebGPU satırını oku.
3. Spector’u kurup dene (isteğe bağlı). WebGPU’de neden
   boş?

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
window.__egitim.info().compute.frameCalls
```

- Flag yok
- chrome://gpu evet
- Spector.js: yalnızca WebGL2 fallback

## Mini görev

`getBackendAdi` çıktısını bir yere not et. Aynı makinede
WebGPU yoksa eğitim neden yine açılıyor? (WebGL2 fallback)

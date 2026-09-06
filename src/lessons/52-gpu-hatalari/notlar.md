# Ders 52 — GPU hataları

## Konu

WebGPU **doğrulama** (validation) hataları sekmenin
çökmesinden önce Console’da görünür. Bu ders kasıtlı
olarak sekmeyi düşürmez; her düğme ne göreceğini
`console.warn` ile anlatır.

Tanıman gerekenler:

- **navigator.gpu yok** — API yok / izin / eski tarayıcı
- **shader compile** — TSL → WGSL derleme hatası
- **invalid buffer** — boyut, usage, offset
- **binding** — layout ≠ resource
- **pipeline validation** — vertex format / shader uyumsuz
- **device lost** — sürücü reset, timeout
- **OOM** — bellek bitti
- **WebGPU validation** — genel kırmızı `[Invalid ...]`

## Mantık

```
JS komut → WebGPU doğrulama
  → warn/error Console
  → çizim atlanır veya device lost
```

Zararsız `uniform({ x: "metin" })` JS’de geçebilir;
asıl tip GPU’ya gidince kırılır. Bu yüzden “sessiz
kabul” ≠ doğru shader.

OOM demosu yapmıyoruz: 4K tampon üretmek sekmeyi kilitler.

## Kod

Düğmeler log üretir. `requestAdapter` güvenlidir.
HUD’daki kırmızı küre sahnenin yaşadığını gösterir.

## Deney

1. navigator.gpu. Nesne mi, yok mu?
2. Validation düğmesi. Console’da ne var?
3. chrome://gpu ile “Hardware accelerated” karşılaştır.

## Browser DevTools

```js
window.__egitim.info()
window.__egitim.backend()
```

- Console filtresi: Verbose aç; validation orada
- `chrome://gpu`
- Spector.js bu hataları WebGPU’de göstermez
- Sekmeyi yenilemek device lost sonrası doğru iyileştirme

## Mini görev

Kasten `colorNode = 3` gibi bir şey yazma (ders dosyasını
bozma). Bunun yerine Console’da eski bir validation
mesajını oku: hangi sözcük tipi söylüyor?

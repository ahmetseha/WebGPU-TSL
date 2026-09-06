# Ders 25 — Fresnel

## Konu

**Fresnel** — bakış açısı yüzey normale dikleştikçe yansımanın artmasıdır. Kenar parlar, orta kararır (veya tersi).

Formül (öğretim):

```
V = normalize(cameraPosition - positionWorld)
F = pow(1 - saturate(abs(N·V)), güç)
```

Basit alternatif: `dot(normalView, vec3(0,0,1))` — kamera uzayında “ileri”. Dünya uzayı kamera dönünce doğru kalır.

Neden kullanılır? Rim light, hologram, kalkan, gezegen atmosferi, ıslak göz.

## Mantık

```
N · V ≈ 1   yüz bize bakıyor     F ≈ 0
N · V ≈ 0   siluet / teğet       F ≈ 1
```

- **Rim** — albedo + kenar rengi. Opak.
- **Hologram** — F + yatay tarama + emissive + alpha.
- **Kalkan** — F * noise. Kesişim hissi: kenar ve lekeler birlikte.
- **Atmosfer** — iç koyu küre + dış kabuk `opacity = F`.

`depthWrite = false` saydam kabuğun iç gezegeni ezmemesi için.

## Kod

`abs(dot)` arka yüzü de parlatır (ince kabuk). Tek taraflı istersen `abs`’i kaldır.

Güç slider’ı halkayı incelterek kalınlaştırır.

## Deney

1. Güç `0.8` → `5`. Kenar neden ip gibi incelir? `pow` yüksek üs mü?
2. **Hologram**. Tarama çizgileri UV.y’de. Orbit, çizgiler nesneyle mi döner?
3. **Atmosfer**. Ortası neden delik? `opacity = F` merkezde ~0 mı?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — iç küre + kabuk + output.
- Saydam + `depthWrite false` overdraw artırır; frame ms’e bak.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

`abs`’i kaldırıp küreyi içinden bak (orbit). Arka yüz neden kararır? İki taraflı kalkan için `side = DoubleSide` gerekir mi?

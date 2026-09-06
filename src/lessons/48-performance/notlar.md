# Ders 48 — Performans

## Konu

**FPS** bir sonuçtur, teşhis değildir. 60 FPS ≈ kare
**16.67 ms** içinde bitmeli. Gecikme CPU’da (JS, draw call)
veya GPU’da (üçgen, shader, overdraw, bellek) olabilir.

Neden üç anahtar?

- **Draw call** — CPU “bunu çiz” der; 180 ayrı Mesh = 180
  komut. `InstancedMesh` = 1 komut, 180 kopya.
- **Üçgen** — segment 8 → 32 geometriyi şişirir, call aynı
  kalabilir.
- **Shader** — 3 oktav noise her pikselde; overdraw ile
  çarpılır.

Gerçek projede: önce darboğazı ölç, sonra kes.

## Mantık

```
kare süresi = CPU + GPU + senkron
16.67 ms bütçe (60 Hz)
FPS yüksek + frame-ms 22 → kareler düzensiz
```

HUD zaten FPS, frame ms, drawCalls, triangles, geometries,
textures gösterir. Bu ders onları oynatır.

Overdraw: aynı pikseli defalarca boyamak. Additive parçacık
ve şeffaf düzlemler GPU’yu yer, draw call az olsa bile.

## Kod

Aynı `SphereGeometry` paylaşılır — bellek düşük kalır,
draw call ayrı Mesh’te patlar. Pahalı malzeme `colorNode`
üç `mx_noise_float` katmanıdır.

## Deney

1. Ayrı Mesh. drawCalls ≈ 180. FPS düştü mü, frame-ms?
2. Instanced + yüksek segment. Call 1, triangles uçtu.
3. Pahalı shader. Üçgen aynı, kare neden yavaşlar?

## Browser DevTools

```js
window.__egitim.info()
```

- Performance: 3 sn kayıt, kare çubuğu 16.67 ms çizgisini
  aşıyor mu?
- Memory: dispose yoksa `geometries` ders değişince düşer
  (runner temizler)
- `chrome://gpu`
- Spector.js WebGPU karesini yakalamaz

## Mini görev

Ayrı Mesh + yüksek segment + pahalı shader. Sonra tek tek
kapat. İlk kazancı hangi düğme verdi? Neden?

## Tekrar

1. FPS 60 iken neden takılma hissedilir?
2. Draw call ile üçgen maliyetini ayır.
3. Overdraw nedir?

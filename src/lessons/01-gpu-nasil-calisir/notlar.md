# Ders 1 — GPU nasıl çalışır?

## Konu

**GPU** (Graphics Processing Unit — grafik işlem birimi) aynı küçük işlemi aynı anda binlerce kez çalıştırır. **CPU** az çekirdekle karmaşık iş yapar. GPU binlerce küçük çekirdekle her vertex ve her piksel için aynı programı koşturur.

Neden kullanılır? 1920×1080 × 60 FPS ≈ 124 milyon piksel kararı. CPU bunu tek tek yapamaz.

Gerçek projede her 3D sahne, ürün görselleştirme, shader ve parçacık GPU’dan geçer.

## Mantık

```
CPU (Three.js)
  → Draw Call
GPU
  → Vertex → Triangle → Rasterization → Fragment → Framebuffer → Screen
```

- **Vertex** — işlenen köşe
- **Triangle** — GPU’nun temel şekli
- **Draw Call** — “bunu çiz” komutu
- **Fragment** — üçgenin piksel adayı
- **Framebuffer** — kare tamponu
- **Render pipeline** — vertex’ten ekrana hat

`BoxGeometry` görünen 8 köşeye rağmen 24 vertex ve 36 index üretir. HUD’daki `triangles` içindeki +1, renderer’ın output pass üçgenidir.

## Kod

`BoxGeometry` buffer üretir. `Mesh` üçgen doldurur, `WireframeGeometry` kenar çizer, `Points` vertex’leri nokta yapar. Her görünür nesne ≈ 1 draw call.

## Deney

1. Segment `1` → `8`. Triangle neden artar?
2. Tel kafes / vertex kapat. drawCalls neden düşer?
3. 5 mesh ekle. Neden 1 draw call’da kalmaz?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `render.drawCalls` — bu kare
- `render.calls` — uygulama başından beri, sürekli artar
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

`SphereGeometry(1, 8, 8)` ve `(1, 32, 32)` ekle. Triangle değişir, draw call aynı kalır. Neden?

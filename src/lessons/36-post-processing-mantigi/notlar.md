# Ders 36 — Post-processing mantığı

## Konu

**Render target** — GPU’nun ekran yerine bir **doku**ya
çizdiği tampon. Post-processing: sahneyi o dokuya al,
efekt uygula, sonucu ekrana bas.

Neden? Bloom, renk grading, UI overlay sahneyi ikinci
kez modellemez. Tek ekstra full-screen pass yeter.

Gerçek projede: film look, damage flash, gece görüşü.

## Mantık

```
renderer.render(scene, camera)     → doğrudan ekran
         ↓
pass(scene, camera)                → Render Target
getTextureNode()                   → o hedefin rengi
efekt (mix tint)                   → yeni renk
RenderPipeline.render()            → quad → ekran
```

Runner `render()` görürse `renderer.render` **çağırmaz**.
İkisini birden çağırırsan sahne iki kez çizilir.

Tint bilinçli çirkin: pass’in çalıştığını kanıtlar.
Kapatınca ham sahne dokusu gelir.

## Kod

`new RenderPipeline(renderer)` + `outputNode = mix(...)`.
Handle: `{ render: () => pipeline.render(), dispose }`.

## Deney

1. Tint kapat/aç. Neden tüm sahne ısınır, tek mesh değil?
2. `0.22` → `0.8`. Sahne neden kaybolur?
3. HUD `textures` artar mı? (hedef dokusu)

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `memory.textures` — pass hedefi sayıyı yükseltebilir
- `drawCalls` — sahne + full-screen quad
- `chrome://gpu`

## Mini görev

Tint yerine `sahneRenk.rgb.mul(vec3(1, 0.2, 1))` yaz.
Magenta proof-pass. Slider ile karışım miktarı.

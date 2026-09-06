# Ders 38 — Bloom

## Konu

**Bloom** — eşik üstü parlak pikselleri bulanıklaştırıp
sahneye geri eklemek. “Işık taşıyor” hissi.

Neden bazı objeler parlar? Materyal **emissive** (yayan)
veya HDR değerde çok açık renk. Karanlık küre eşik altında
kalır, parlamaz.

**HDR** — 0..1’e sıkışmamış renk (2.0, 4.0…). Pass hedefi
HalfFloat tutar; bloom bunu okuyabilir.

Gerçek projede: neon, güneş, sihir, headlights.

## Mantık

```
sahne (emissive yüksek)
  → pass dokusu (HDR)
  → threshold: karanlık kes
  → blur (mip)
  → output = sahne + bloom
```

Eşik yükselince sadece en parlak çekirdek kalır.
Güç, eklenen bulanık ışığın katsayısıdır.

Karanlık `MeshBasic` küre kasıtlı: glow yok, karşılaştır.

## Kod

`bloom()` addons’tan. Slider `strength.value` /
`threshold.value` yazar. `pipeline.render()` zorunlu.
`dispose` bloom hedeflerini de bırakır.

## Deney

1. Eşik 0. Eşik 0.9. Hangisi “her şey sis”?
2. Güç 0. Bloom yok — emissive küre hâlâ mı parlak?
3. Karanlık küreyi emissive 3 yap (mini görevden önce
   tahmin: o da hale alır).

## Browser DevTools

Spector.js kullanma.

```js
window.__egitim.info()
```

- `memory.textures` bloom mip’leriyle artar
- `drawCalls` blur geçişleri yüzünden yükselir
- `chrome://gpu`

## Mini görev

Sarı kürenin `emissiveNode` çarpanını 4.2 → 0.4 yap.
Eşik 0.35 iken hale kaybolur mu? Neden?

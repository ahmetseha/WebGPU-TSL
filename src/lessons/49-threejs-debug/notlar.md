# Ders 49 — Three.js debug

## Konu

`renderer.info` Three.js’in kare sayacıdır. HUD zaten canlı
gösterir; bu ders her alanı **tek tek** açıklar ve
`console.table` ile dondurur.

Neden? “Sahne yavaş” cümlesi işe yaramaz. Sayı olmadan
tahmin edersin.

## Mantık

| Alan | Anlam |
| drawCalls | Bu karede kaç çizim komutu |
| triangles | Raster’a giden üçgen (output pass +1 olabilir) |
| points | Nokta primitive sayısı |
| lines | Çizgi primitive |
| frameCalls | Bu karedeki render geçişi |
| calls | Uygulama açıldığından beri — sürekli artar |
| compute.frameCalls | Bu kare compute dispatch |
| memory.geometries | GPU’da tutulan geometri |
| memory.textures | GPU’da tutulan doku |

`calls` ile `drawCalls` karıştırma. İlki ömür, ikincisi kare.

Canlı overlay (`#hud`) aynı kaynak. Ek açıklamalar
`#istatistik-ek` içinde.

## Kod

`consolaYazdir` `window.__egitim` ile aynı tabloyu basar.
Küre ekle: drawCalls +1, geometries aynı (paylaşılan geo).

```js
window.__egitim.info()
window.__egitim.backend()
```

## Deney

1. console.table. `calls` iki kez basınca artar mı?
2. 5 küre ekle. drawCalls? geometries?
3. compute.frameCalls neden 0? Bu sahnede compute yok.

## Browser DevTools

- Console: tabloya bak, satırları oku
- `chrome://gpu`
- Spector.js kullanma — WebGPU frame yok
- Performance’a bu derste gerek yok; 50. derste

## Mini görev

Tel kafes (`LineSegments`) ekle. `lines` artar,
`triangles` nasıl değişir? Tahmin et, sonra dene.

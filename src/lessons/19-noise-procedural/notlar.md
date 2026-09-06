# Ders 19 — Noise ile procedural shader

## Konu

Aynı `mx_noise_float` dört görünüme gider: yükseklik renkli **arazi**, eşikli **bulut**, gri **duman**, eşik ile **dissolve**.

Neden kullanılır? Dört bitmap yerine bir fonksiyon. Eşik ve renk paleti değiştirmek yeni asset demek değildir.

Gerçek projede planet mask, büyü ile yok olma, sis kartı ve stylized terrain hep bu palet+threshold kalıbıdır.

## Mantık

```
n = noise(uv * 6 + (0, -time))     0..1
arazi     n'yi yeşil → kum → kar
bulut     n > 0.42 ise beyaz
duman     n'yi griye yaz, UV yukarı kayar
dissolve  step(eşik, n)  delik açar
```

`smoothstep` yumuşak bant. `step` jilet kesim — dissolve'un “yanık kenar” hissi buradan gelir.

`opacityNode = erime` sadece dissolve modunda aktif. Delikten sahne rengi görünür.

## Kod

Plane ve küre **aynı materyali** paylaşır. UV kürede kutuplarda sıkışır; noise orada uzar. Bu bir hata değil, spherical UV gerçeği.

Eşik slider’ı sadece dissolve’da anlamlıdır ama graph her zaman `n` üretir. Kullanılmayan dal GPU’da ucuz kalır; yine de öğretim için tek graph yeter.

## Deney

1. **Arazi** → **Bulut**. Aynı `n` neden farklı okunur? Renk haritası mı değişti?
2. Dissolve eşik `0.2` → `0.8`. Mesh neden “yenir”? `step` hangi tarafı atar?
3. **Küre / plane**. Kutuplarda desen neden gerilir? UV orada mı bozulur?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- `drawCalls` — görünür mesh + output. İkinci şekli gizleyince düşer.
- `triangles` — küre 48×32 plane’den çok daha fazla.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

Dissolve’da `mix(renk, kırmızı, smoothstep(eşik, eşik+0.05, n))` ile kenara ateş halkası ekle. Eşik neden hem deliği hem halkayı birlikte kaydırır?

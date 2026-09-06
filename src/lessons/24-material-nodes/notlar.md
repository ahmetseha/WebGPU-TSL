# Ders 24 — Material nodes

## Konu

Node material bir **giriş panosudur**. Her kanal ayrı TSL grafiği kabul eder:

- `colorNode` — albedo
- `roughnessNode` / `metalnessNode` — PBR
- `emissiveNode` — kendi ışığı (bloom’un yemi, sonraki bölümler)
- `opacityNode` — alpha, `transparent = true` şart
- `positionNode` / `normalNode` — 20–22’de işlendi

Neden kullanılır? Bitmap yerine fonksiyon bağlarsın: ıslak kenar, pas maskesi, nabız emisyon.

Gerçek projede her “akıllı materyal” bu soketlerin dolu halidir.

## Mantık

```
slider → uniform.value  (CPU, kare başı bir float)
       → GPU fragment
           color     = vec3(r,g,b)
           roughness = purluk
           metalness = metal
           emissive  = turuncu * emisyon
           opacity   = saydam
```

`roughness = 0` + `metalness = 1` ≈ ayna. `emissive` ışık olmasa da parlar — Basic gibi değil, üzerine PBR de biner.

Opacity 0.2: küre camlaşır. Depth write açık kalabilir; sıralama artefact’ı normaldir.

## Kod

Tek küre, tek `MeshStandardNodeMaterial`. Slider `sayiBagla` ile uniform’a yazılır. Graph yeniden kurulmaz.

## Deney

1. Roughness `1` → `0`. Highlight neden küçülüp keskinleşir?
2. Metalness `0` → `1` (roughness düşük). Neden çevre rengi (ışık rengi) albedo’yu baskılar?
3. Emissive `1.5`, opacity `0.3`. Neden hem cam hem lav lambası?

## Browser DevTools

WebGL aracı kullanma. Spector.js bu sahnede çalışmaz.

```js
window.__egitim.info()
window.__egitim.backend()
```

- Slider çevirmek `drawCalls` değiştirmez. Uniform ucuzdur.
- `transparent` overdraw artırabilir; Performance’da frame ms’e bak.
- `chrome://gpu` → WebGPU: Hardware accelerated
- Flag gerekmez

## Mini görev

`roughnessNode = uv().y` bağla (slider’ı geçici unut). Alt neden mat, üst neden ıslak? UV.y aşağıdan yukarı mı?

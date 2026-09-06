import { dilAl, type Dil } from "@/i18n/dil"

const metinler = {
	telKafes: { tr: "Tel kafes", en: "Wireframe" },
	vertexler: { tr: "Vertexler", en: "Vertices" },
	meshEkle: { tr: "Mesh ekle", en: "Add mesh" },
	meshSil: { tr: "Mesh sil", en: "Remove mesh" },
	segment: { tr: "Segment", en: "Segment" },
	uzay: { tr: "Uzay", en: "Space" },
	ruzgar: { tr: "Rüzgar", en: "Wind" },
	yercekimi: { tr: "Yerçekimi", en: "Gravity" },
	surtunme: { tr: "Sürtünme", en: "Friction" },
	fareGucu: { tr: "Fare gücü", en: "Mouse force" },
	cekim: { tr: "Çekim", en: "Attract" },
	itme: { tr: "İtme", en: "Repel" },
	adet: { tr: "Adet", en: "Count" },
	genlik: { tr: "Genlik", en: "Amplitude" },
	sifirla: { tr: "Sıfırla", en: "Reset" },
	fresnelGuc: { tr: "Fresnel güç", en: "Fresnel power" },
	noiseOlcek: { tr: "Noise ölçek", en: "Noise scale" },
	yogunluk: { tr: "Yoğunluk", en: "Density" },
	tekrar: { tr: "Tekrar", en: "Repeat" },
	renk: { tr: "Renk", en: "Color" },
	maske: { tr: "Maske", en: "Mask" },
	hiz: { tr: "Hız", en: "Speed" },
	sis: { tr: "Sis", en: "Fog" },
	depthRenk: { tr: "Depth renk", en: "Depth color" },
	odak: { tr: "Odak", en: "Focus" },
	guc: { tr: "Güç", en: "Power" },
	esik: { tr: "Eşik", en: "Threshold" },
	kol: { tr: "Kol", en: "Arms" },
	burgu: { tr: "Burgu", en: "Twist" },
	boyut: { tr: "Boyut", en: "Size" },
	ham: { tr: "Ham", en: "Raw" },
	su: { tr: "Su", en: "Water" },
	enerji: { tr: "Enerji", en: "Energy" },
	lav: { tr: "Lav", en: "Lava" },
	olcek: { tr: "Ölçek", en: "Scale" },
	donus: { tr: "Dönüş", en: "Rotation" },
	kaydirma: { tr: "Kaydırma", en: "Scroll" },
	kaydir: { tr: "Kaydır", en: "Shift" },
	nabiz: { tr: "Nabız", en: "Pulse" },
	daire: { tr: "Daire", en: "Circle" },
	dalga: { tr: "Dalga", en: "Wave" },
	gurultu: { tr: "Gürültü", en: "Noise" },
	ayriMesh: { tr: "Ayrı Mesh", en: "Separate meshes" },
	segDusuk: { tr: "Segment düşük", en: "Low segments" },
	segYuksek: { tr: "Segment yüksek", en: "High segments" },
	shaderUcuz: { tr: "Shader ucuz", en: "Cheap shader" },
	shaderPahali: { tr: "Shader pahalı", en: "Expensive shader" },
	isikAcik: { tr: "Işık açık", en: "Light on" },
	bayrak: { tr: "Bayrak", en: "Flag" },
	arazi: { tr: "Arazi", en: "Terrain" },
	jel: { tr: "Jel", en: "Jelly" },
	frekans: { tr: "Frekans", en: "Frequency" },
	serit: { tr: "Şerit", en: "Stripes" },
	dama: { tr: "Dama", en: "Checker" },
	halka: { tr: "Halka", en: "Ring" },
	izgara: { tr: "Izgara", en: "Grid" },
	gradyan: { tr: "Gradyan", en: "Gradient" },
	radyal: { tr: "Radyal", en: "Radial" },
	tintKaniti: { tr: "Tint kanıtı", en: "Tint proof" },
	yalnizU: { tr: "Yalnız U", en: "U only" },
	bulut: { tr: "Bulut", en: "Cloud" },
	duman: { tr: "Duman", en: "Smoke" },
	kurePlane: { tr: "Küre / plane", en: "Sphere / plane" },
	kureEkle: { tr: "Küre ekle", en: "Add sphere" },
	kureSil: { tr: "Küre sil", en: "Remove sphere" },
	dokuSizdir: { tr: "Doku sızdır", en: "Leak texture" },
	dokuDispose: { tr: "Doku dispose", en: "Dispose texture" },
	backendYaz: { tr: "Backend yaz", en: "Log backend" },
	shaderDerleme: { tr: "Shader derleme", en: "Shader compile" },
	gecersizBuffer: { tr: "Geçersiz buffer", en: "Invalid buffer" },
	rimIsik: { tr: "Rim ışık", en: "Rim light" },
	kalkan: { tr: "Kalkan", en: "Shield" },
	atmosfer: { tr: "Atmosfer", en: "Atmosphere" },
	patlat: { tr: "Patlat", en: "Explode" },
	cpuYaz: { tr: "CPU yaz", en: "CPU write" },
	ayri2000: { tr: "2000 ayrı Mesh", en: "2000 separate meshes" },
	solBasic: {
		tr: "Sol Basic · orta Standard · sağ Physical",
		en: "Left Basic · middle Standard · right Physical"
	},
	bilinmiyor: { tr: "Bilinmiyor", en: "Unknown" },
	gpuYok: { tr: "navigator.gpu yok", en: "navigator.gpu missing" },
	adapterYok: { tr: "adapter alınamadı", en: "no adapter" },
	computeYokKar: {
		tr: "compute yok · CPU kar",
		en: "no compute · CPU snow"
	},
	karCompute: {
		tr: "kar · compute + Sprite",
		en: "snow · compute + Sprite"
	},
	yerFareCompute: {
		tr: "yerçekimi + fare · compute",
		en: "gravity + mouse · compute"
	},
	computeYokYedek: {
		tr: "compute yok · CPU yedek",
		en: "no compute · CPU fallback"
	},
	pvaGpgpu: {
		tr: "p / v / a tamponları · GPGPU",
		en: "p / v / a buffers · GPGPU"
	},
	konumHizCompute: {
		tr: "konum + hız · compute",
		en: "position + velocity · compute"
	},
	kampGpu: {
		tr: "kamp · instance + 2 compute + bloom",
		en: "camp · instance + 2 compute + bloom"
	},
	kampCpu: {
		tr: "kamp · kar/duman CPU yedek",
		en: "camp · snow/smoke CPU fallback"
	},
	computeYokWebgl: {
		tr: "compute yok · WebGL",
		en: "no compute · WebGL"
	},
	emissiveBloom: {
		tr: "emissive + bloom",
		en: "emissive + bloom"
	},
	passTint: { tr: "pass + tint", en: "pass + tint" },
	passHam: { tr: "pass ham", en: "raw pass" },
	solTip: {
		tr: "sol: tip · sağ: vec3 positionLocal",
		en: "left: type · right: vec3 positionLocal"
	},
	fpsYetmez: {
		tr: "FPS tek başına yetmez. 16.67 ms = 60 Hz.",
		en: "FPS alone is not enough. 16.67 ms = 60 Hz."
	},
	cpuGpu: {
		tr: "CPU: JS + draw call. GPU: üçgen + shader + overdraw.",
		en: "CPU: JS + draw call. GPU: triangles + shader + overdraw."
	},
	sekmeKirilmaz: {
		tr: "Sekmeyi kırmayız. Console.warn örnekleri.",
		en: "We do not crash the tab. Console.warn samples."
	},
	chromePanelYok: {
		tr: "Chrome’da yerleşik WebGPU paneli yok.",
		en: "Chrome has no built-in WebGPU panel."
	},
	spectorWebgl: {
		tr: "WebGL2: Spector.js frame yakalayabilir.",
		en: "WebGL2: Spector.js can capture a frame."
	},
	spectorWebgpu: {
		tr: "WebGPU: Spector.js bu kareyi YAKALAMAZ.",
		en: "WebGPU: Spector.js will NOT capture this frame."
	},
	inspectorEklenti: {
		tr: "İsteğe bağlı: WebGPU Inspector eklentisi.",
		en: "Optional: WebGPU Inspector extension."
	},
	aracConsole: {
		tr: "Araç: console + info + chrome://gpu",
		en: "Tools: console + info + chrome://gpu"
	},
	eskiFlag: {
		tr: "Eski WebGPU flag önerme.",
		en: "Do not recommend the old WebGPU flag."
	},
	gpuAcik: {
		tr: "chrome://gpu açık — eski WebGPU flag yok.",
		en: "chrome://gpu is enough — no old WebGPU flag."
	},
	drawCallsKare: {
		tr: "bu kare çizim",
		en: "draws this frame"
	},
	trianglesRaster: {
		tr: "raster üçgen",
		en: "raster triangles"
	},
	pointsLines: {
		tr: "nokta-çizgi",
		en: "points-lines"
	},
	frameCallsKare: {
		tr: "bu kare render",
		en: "renders this frame"
	},
	callsOmur: {
		tr: "uygulama ömrü (artar)",
		en: "app lifetime (keeps rising)"
	},
	geoTexBellek: { tr: "bellek", en: "memory" },
	consoleAdim: {
		tr: "1. Console: hatalar ve __egitim.info()",
		en: "1. Console: errors and __egitim.info()"
	},
	perfAdim: {
		tr: "2. Performance: kare < 16.67 ms mi?",
		en: "2. Performance: is the frame < 16.67 ms?"
	},
	memAdim: {
		tr: "3. Memory: sızdır / temizle",
		en: "3. Memory: leak / dispose"
	},
	netAdim: {
		tr: "4. Network: ağır asset yok — ne aranır?",
		en: "4. Network: no heavy asset — what do you look for?"
	},
	renderAdim: {
		tr: "5. Rendering: FPS meter, paint flashing",
		en: "5. Rendering: FPS meter, paint flashing"
	},
	efekt: { tr: "efekt", en: "effect" },
	yas: { tr: "yaş", en: "age" },
	ayriMeshN: { tr: "{n} ayrı Mesh", en: "{n} separate meshes" },
	instanceBir: {
		tr: "{n} instance · 1 mesh",
		en: "{n} instances · 1 mesh"
	},
	noktaCompute: {
		tr: "{n} nokta · compute",
		en: "{n} points · compute"
	},
	noktaTsl: {
		tr: "{n} nokta · TSL konum",
		en: "{n} points · TSL position"
	},
	noktaPoints: {
		tr: "{n} nokta · 1 Points",
		en: "{n} points · 1 Points"
	},
	yildizSpiral: {
		tr: "{n} yıldız · spiral",
		en: "{n} stars · spiral"
	},
	instanceDalga: {
		tr: "{n} instance · GPU dalga",
		en: "{n} instances · GPU wave"
	},
	yasSaniye: { tr: "yaş {n}s", en: "age {n}s" },
	gpuYokUzun: {
		tr: "navigator.gpu yok. WebGPU kapalı veya destek yok. Fallback WebGL2.",
		en: "navigator.gpu missing. WebGPU off or unsupported. Fallback WebGL2."
	},
	gpuVarUzun: {
		tr: "navigator.gpu var. Adapter isteği güvenli; sekmeyi düşürmez.",
		en: "navigator.gpu exists. Requesting an adapter is safe; it will not crash the tab."
	},
	shaderUyar: {
		tr: "Shader compile: TSL → WGSL. Hata Console’da kırmızı [WebGPU]. Bu demo derlemeyi bozmaz.",
		en: "Shader compile: TSL → WGSL. Errors show as red [WebGPU] in the Console. This demo does not break compile."
	},
	bufferUyar: {
		tr: "Invalid buffer: boyut veya usage uyuşmaz. Console: validation. Sayfa genelde açık kalır.",
		en: "Invalid buffer: size or usage mismatch. Console: validation. The page usually stays up."
	},
	bindUyar: {
		tr: "Binding: layout ≠ resource tipi. Görüntü kaybolur veya kırmızı log.",
		en: "Binding: layout ≠ resource type. The image vanishes or you get a red log."
	},
	pipeUyar: {
		tr: "Pipeline validation: vertex format shader ile uyuşmaz. CreateRenderPipeline başarısız log’u.",
		en: "Pipeline validation: vertex format does not match the shader. CreateRenderPipeline failure log."
	},
	lostUyar: {
		tr: "device lost: sürücü reset / timeout. renderer durur. Sayfayı yenile. GPU.process crash ayrıdır.",
		en: "device lost: driver reset / timeout. The renderer stops. Reload the page. A GPU.process crash is separate."
	},
	oomUyar: {
		tr: "OOM: çok büyük buffer/texture. 8K dizi üretmiyoruz — sekme şişmesin.",
		en: "OOM: buffer/texture too large. We do not allocate an 8K array — keep the tab alive."
	},
	validUyar: {
		tr: "Zararsız geçersiz uniform: JS nesne. Asıl validation render anında.",
		en: "Harmless invalid uniform: a JS object. Real validation happens at render time."
	},
	computeYaziyor: {
		tr: "Compute WebGPU’da yazıyor",
		en: "Compute is writing on WebGPU"
	},
	computeIsterBackend: {
		tr: "Compute WebGPU ister. Backend: {ad}",
		en: "Compute needs WebGPU. Backend: {ad}"
	},
	computeIsterYedek: {
		tr: "Compute WebGPU ister. WebGL — CPU yedek.",
		en: "Compute needs WebGPU. WebGL — CPU fallback."
	},
	computeIsterKamp: {
		tr: "Compute WebGPU ister. Kar/duman CPU veya TSL.",
		en: "Compute needs WebGPU. Snow/smoke is CPU or TSL."
	},
	kampNot: {
		tr: "Sessiz kış kampı — tek sahne, tek ruh hali.",
		en: "A quiet winter camp — one scene, one mood."
	},
	karSavrulur: {
		tr: "Kameraya yaklaşınca taneler savrulur.",
		en: "Flakes scatter when the camera gets close."
	},
	sariHedef: {
		tr: "Sarı nokta hedef. İvme ona doğru yazılır.",
		en: "The yellow point is the target. Acceleration writes toward it."
	},
	tepeCimen: {
		tr: "Tek tepe, çimen, kaya. Efekt çöplüğü değil.",
		en: "One hill, grass, rock. Not an effects junkyard."
	},
	solOlcek: {
		tr: "Sol ölçek · orta renk · sağ konum",
		en: "Left scale · middle color · right position"
	},
	gpuHazir: {
		tr: "navigator.gpu var — requestAdapter() hazır",
		en: "navigator.gpu present — requestAdapter() is ready"
	},
	gpuYedek: {
		tr: "navigator.gpu yok — WebGL yedek",
		en: "navigator.gpu missing — WebGL fallback"
	},
	henuzOrnek: {
		tr: "Henüz örnek yok — düğmeye bas.",
		en: "No sample yet — press a button."
	},
	hashRastgele: {
		tr: "hash rastgele",
		en: "hash random"
	},
	noiseOlcek4: {
		tr: "noise ölçek 4",
		en: "noise scale 4"
	},
	noiseOlcek20: {
		tr: "noise ölçek 20",
		en: "noise scale 20"
	},
	normalViewRenk: {
		tr: "normalView renk",
		en: "normalView color"
	},
	positionLocalRenk: {
		tr: "positionLocal renk",
		en: "positionLocal color"
	}
} as const

export type KontrolAnahtar = keyof typeof metinler

const doldur = (
	sablon: string,
	degisken?: Record<string, string | number>
): string => {
	if (degisken === undefined) {
		return sablon
	}
	let cikti = sablon
	for (const [ad, deger] of Object.entries(degisken)) {
		cikti = cikti.replaceAll(`{${ad}}`, String(deger))
	}
	return cikti
}

export function ky(
	anahtar: KontrolAnahtar,
	degisken?: Record<string, string | number>
): string {
	return doldur(metinler[anahtar][dilAl()], degisken)
}

export function kyVar(ad: string): string {
	if (ad in metinler) {
		return ky(ad as KontrolAnahtar)
	}
	return ad
}

function anahtarBul(metin: string): KontrolAnahtar | undefined {
	const temiz = metin.replace(/\s+/g, " ").trim()
	if (temiz === "") {
		return undefined
	}
	for (const [anahtar, dil] of Object.entries(metinler)) {
		if (dil.tr === temiz || dil.en === temiz) {
			return anahtar as KontrolAnahtar
		}
	}
	return undefined
}

function ilkMetin(el: Element): Text | null {
	for (const dugum of el.childNodes) {
		if (
			dugum.nodeType === Node.TEXT_NODE &&
			(dugum.textContent ?? "").trim() !== ""
		) {
			return dugum as Text
		}
	}
	return null
}

const yaz = (
	el: HTMLElement,
	dil: Dil,
	anahtar: KontrolAnahtar
): void => {
	const hedef = doldur(metinler[anahtar][dil])
	const dugum = ilkMetin(el)
	if (dugum !== null) {
		const ham = dugum.textContent ?? ""
		dugum.textContent = ham.replace(ham.trim(), hedef)
		return
	}
	if (el.childElementCount === 0) {
		el.textContent = hedef
	}
}

export function metinleriUygula(
	kok: ParentNode | null
): void {
	if (kok === null) {
		return
	}
	const dil = dilAl()

	const isaretli = kok.querySelectorAll<HTMLElement>(
		"[data-i18n-k]"
	)
	for (const el of isaretli) {
		const anahtar = el.dataset.i18nK
		if (anahtar !== undefined && anahtar in metinler) {
			yaz(el, dil, anahtar as KontrolAnahtar)
		}
	}

	const ham = kok.querySelectorAll("button, label, p, strong")
	for (const el of ham) {
		if (!(el instanceof HTMLElement) || el.dataset.i18nK) {
			continue
		}
		const dugum = ilkMetin(el)
		const metin =
			dugum?.textContent ??
			(el.childElementCount === 0 ? el.textContent : null)
		if (metin === null) {
			continue
		}
		const anahtar = anahtarBul(metin)
		if (anahtar === undefined) {
			continue
		}
		el.dataset.i18nK = anahtar
		yaz(el, dil, anahtar)
	}
}

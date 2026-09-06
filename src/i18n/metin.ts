import type { Dil } from "@/i18n/dil"

export type ArayuzMetni = {
	belgeBaslik: string
	karsilamaEyebrow: string
	karsilamaBaslik: string
	karsilamaOzet: string
	baslat: string
	devam: string
	onceki: string
	sonraki: string
	notlar: string
	notlarKapat: string
	dersSec: string
	ders: string
	yukleniyor: string
	destekVar: string
	destekYok: string
	hudEtiket: string
	anasayfa: string
	ozellikler: string[]
}

export const metin: Record<Dil, ArayuzMetni> = {
	tr: {
		belgeBaslik: "Three.js WebGPU & TSL Eğitimi",
		karsilamaEyebrow: "Açık kaynak eğitim",
		karsilamaBaslik: "GPU’yu ekranda görerek öğren",
		karsilamaOzet:
			"53 interaktif ders. Three.js, WebGPU ve TSL’i kopyala-yapıştır değil, sahneyi bozarak öğren. Notu oku, değeri değiştir, nedenini gör.",
		baslat: "Eğitime başla",
		devam: "Kaldığın yerden devam et",
		onceki: "Önceki",
		sonraki: "Sonraki",
		notlar: "Notlar",
		notlarKapat: "Kapat",
		dersSec: "Ders seç",
		ders: "Ders",
		yukleniyor: "Yükleniyor",
		destekVar: "var",
		destekYok: "yok",
		hudEtiket: "Canlı ölçüm",
		anasayfa: "Ana sayfa",
		ozellikler: [
			"WebGPU + TSL",
			"53 sahne",
			"Türkçe / English"
		]
	},
	en: {
		belgeBaslik: "Three.js WebGPU & TSL Course",
		karsilamaEyebrow: "Open source course",
		karsilamaBaslik: "Learn the GPU by seeing it",
		karsilamaOzet:
			"53 interactive lessons. Learn Three.js, WebGPU, and TSL by breaking the scene — not by copying code. Read the note, change a value, see why.",
		baslat: "Start the course",
		devam: "Continue where you left off",
		onceki: "Previous",
		sonraki: "Next",
		notlar: "Notes",
		notlarKapat: "Close",
		dersSec: "Choose a lesson",
		ders: "Lesson",
		yukleniyor: "Loading",
		destekVar: "yes",
		destekYok: "no",
		hudEtiket: "Live stats",
		anasayfa: "Home",
		ozellikler: [
			"WebGPU + TSL",
			"53 scenes",
			"Türkçe / English"
		]
	}
}

export function t(dil: Dil): ArayuzMetni {
	return metin[dil]
}

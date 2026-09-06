import { Color, Clock } from "three/webgpu"
import type { LessonHandle, LessonModule } from "@/core/lesson"
import { markdownToHtml } from "@/core/markdown"
import { sahneyiTemizle } from "@/core/sahne"
import {
	createWebGPUApp,
	getBackendAdi,
	type WebGPUApp
} from "@/core/webgpu-app"
import { dersMetni, arayuzuUygula } from "@/ui/arayuz"
import {
	baslikOynat,
	ilerlemeyiGuncelle,
	notlariDegistir,
	notlariKapat
} from "@/ui/hareket"
import {
	dilAl,
	dilDinle,
	sonDersiYaz,
	type Dil
} from "@/i18n/dil"
import { t } from "@/i18n/metin"
import { notBasliklariniCevir } from "@/i18n/not-baslik"
import { notEnAl } from "@/i18n/notlar-en"
import { consolaYazdir, debugAc } from "@/utils/debug"
import { yaziYaz } from "@/utils/hud"

function notlariHazirla(
	ders: LessonModule,
	dil: Dil
): string {
	if (dil === "en") {
		return notEnAl(ders.id) ??
			notBasliklariniCevir(ders.notes, "en")
	}

	return ders.notes
}

export type EgitimKumanda = {
	duraklat: () => void
	surdur: () => void
	dersYukle: (id: string) => Promise<void>
}

export async function egitimiBaslat(
	dersler: LessonModule[],
	baslangicId?: string
): Promise<EgitimKumanda> {
	const canvas = document.querySelector("#sahne")

	if (!(canvas instanceof HTMLCanvasElement)) {
		throw new Error("#sahne canvas bulunamadı")
	}

	const app = await createWebGPUApp(canvas)
	const secici = document.getElementById("ders-sec")
	const notlarEl = document.getElementById("notlar-icerik")
	const kontroller = document.getElementById("kontroller")
	const istatistikEk = document.getElementById(
		"istatistik-ek"
	)
	if (
		!(secici instanceof HTMLSelectElement) ||
		notlarEl === null ||
		kontroller === null ||
		istatistikEk === null
	) {
		throw new Error("HUD iskeleti eksik")
	}

	let aktif: LessonHandle | null = null
	let aktifDers: LessonModule | null = null
	let ilkYukleme = true
	const clock = new Clock()

	const basliklariYaz = (ders: LessonModule): void => {
		const dil = dilAl()
		const metin = dersMetni(ders, dil)
		const sozluk = t(dil)
		document.title = `${sozluk.ders} ${ders.no} — ${metin.title}`
		yaziYaz("ders-no", ders.no)
		yaziYaz("ders-baslik", metin.title)
		yaziYaz("ders-bolum", metin.bolum)
		yaziYaz("akis", ders.akis)
		notlarEl.innerHTML = markdownToHtml(
			notlariHazirla(ders, dil)
		)
	}

	const dersYukle = async (id: string): Promise<void> => {
		const ders = dersler.find((d) => d.id === id)

		if (ders === undefined) {
			return
		}

		aktif?.dispose()
		aktif = null
		sahneyiTemizle(app.scene)
		app.scene.background = new Color("#111318")
		app.scene.fog = null
		kontroller.innerHTML = ""
		istatistikEk.innerHTML = ""

		aktifDers = ders
		secici.value = ders.id
		location.hash = ders.id
		sonDersiYaz(ders.id)
		arayuzuUygula(dilAl(), dersler, ders.id)
		basliklariYaz(ders)
		ilerlemeyiGuncelle(Number(ders.no), dersler.length)
		if (!ilkYukleme) {
			baslikOynat()
		}
		ilkYukleme = false

		debugAc(app.renderer, ders.id)
		console.info(
			`${t(dilAl()).ders} ${ders.no}: window.__egitim.info()`
		)

		aktif = await ders.start({
			app,
			kontroller,
			istatistikEk
		})

		consolaYazdir(app.renderer)
	}

	const hashId = location.hash.replace("#", "")
	const ilk =
		dersler.find((d) => d.id === hashId)?.id ??
		dersler.find((d) => d.id === baslangicId)?.id ??
		dersler[0]?.id

	if (ilk === undefined) {
		throw new Error("Ders listesi boş")
	}

	arayuzuUygula(dilAl(), dersler)
	await dersYukle(ilk)

	secici.addEventListener("change", () => {
		void dersYukle(secici.value)
	})

	window.addEventListener("hashchange", () => {
		const id = location.hash.replace("#", "")
		if (id !== "" && id !== aktifDers?.id) {
			void dersYukle(id)
		}
	})

	document
		.getElementById("onceki")
		?.addEventListener("click", () => {
			const i = dersler.findIndex(
				(d) => d.id === aktifDers?.id
			)
			const onceki = dersler[i - 1]
			if (onceki !== undefined) {
				void dersYukle(onceki.id)
			}
		})

	document
		.getElementById("sonraki")
		?.addEventListener("click", () => {
			const i = dersler.findIndex(
				(d) => d.id === aktifDers?.id
			)
			const sonraki = dersler[i + 1]
			if (sonraki !== undefined) {
				void dersYukle(sonraki.id)
			}
		})

	document
		.getElementById("notlar-ac")
		?.addEventListener("click", () => {
			notlariDegistir()
		})

	document
		.getElementById("notlar-kapat")
		?.addEventListener("click", () => {
			void notlariKapat()
		})

	dilDinle((dil) => {
		arayuzuUygula(dil, dersler, aktifDers?.id)
		if (aktifDers !== null) {
			basliklariYaz(aktifDers)
		}
		yaziYaz(
			"webgpu-destek",
			navigator.gpu === undefined
				? t(dil).destekYok
				: t(dil).destekVar
		)
	})

	yaziYaz("backend", getBackendAdi(app.renderer))
	yaziYaz(
		"webgpu-destek",
		navigator.gpu === undefined
			? t(dilAl()).destekYok
			: t(dilAl()).destekVar
	)

	let fpsZaman = 0
	let fpsKare = 0
	let fps = 0

	const kare = (): void => {
		const dt = clock.getDelta()
		fpsZaman += dt
		fpsKare += 1

		if (fpsZaman >= 0.5) {
			fps = Math.round(fpsKare / fpsZaman)
			fpsZaman = 0
			fpsKare = 0
		}

		aktif?.update?.(dt)

		if (aktif?.render !== undefined) {
			aktif.render()
		} else {
			app.renderer.render(app.scene, app.camera)
		}

		const { render, memory, compute } = app.renderer.info
		yaziYaz("draw-calls", render.drawCalls)
		yaziYaz("triangles", Math.round(render.triangles))
		yaziYaz("points", render.points)
		yaziYaz("lines", Math.round(render.lines))
		yaziYaz("geometries", memory.geometries)
		yaziYaz("textures", memory.textures)
		yaziYaz("compute-calls", compute.frameCalls)
		yaziYaz("fps", fps)
		yaziYaz(
			"frame-ms",
			`${(dt * 1000).toFixed(1)} ms`
		)
	}

	app.renderer.setAnimationLoop(kare)

	return {
		duraklat: () => {
			app.renderer.setAnimationLoop(null)
		},
		surdur: () => {
			app.renderer.setAnimationLoop(kare)
		},
		dersYukle
	}
}

export type { WebGPUApp }

import { Color, Clock } from "three/webgpu"
import type { LessonHandle, LessonModule } from "@/core/lesson"
import { markdownToHtml } from "@/core/markdown"
import { sahneyiTemizle } from "@/core/sahne"
import {
	createWebGPUApp,
	getBackendAdi,
	type WebGPUApp
} from "@/core/webgpu-app"
import { consolaYazdir, debugAc } from "@/utils/debug"
import { yaziYaz } from "@/utils/hud"

export async function egitimiBaslat(
	dersler: LessonModule[]
): Promise<void> {
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
	const notlarPanel = document.getElementById("notlar")

	if (
		!(secici instanceof HTMLSelectElement) ||
		notlarEl === null ||
		kontroller === null ||
		istatistikEk === null
	) {
		throw new Error("HUD iskeleti eksik")
	}

	for (const ders of dersler) {
		const opt = document.createElement("option")
		opt.value = ders.id
		opt.textContent = `${ders.no} — ${ders.title}`
		secici.append(opt)
	}

	let aktif: LessonHandle | null = null
	let aktifDers: LessonModule | null = null
	const clock = new Clock()

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
		document.title = `Ders ${ders.no} — ${ders.title}`
		yaziYaz("ders-no", `Ders ${ders.no}`)
		yaziYaz("ders-baslik", ders.title)
		yaziYaz("ders-bolum", ders.bolum)
		yaziYaz("akis", ders.akis)
		notlarEl.innerHTML = markdownToHtml(ders.notes)
		location.hash = ders.id

		debugAc(app.renderer, ders.id)
		console.info(
			`Ders ${ders.no}: window.__egitim.info()`
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
		dersler[0]?.id

	if (ilk === undefined) {
		throw new Error("Ders listesi boş")
	}

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
			notlarPanel?.classList.toggle("kapali")
		})

	yaziYaz("backend", getBackendAdi(app.renderer))
	yaziYaz(
		"webgpu-destek",
		navigator.gpu === undefined ? "yok" : "var"
	)

	let fpsZaman = 0
	let fpsKare = 0
	let fps = 0

	app.renderer.setAnimationLoop(() => {
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
	})
}

export type { WebGPUApp }

import {
	Color,
	Mesh,
	MeshStandardNodeMaterial,
	TorusGeometry
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import { getBackendAdi } from "@/core/webgpu-app"
import { consolaYazdir } from "@/utils/debug"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "51",
	no: "51",
	title: "WebGPU debug araçları",
	bolum: "Bölüm 26 — WebGPU debug araçları",
	akis: "Spector.js ≠ WebGPU · console + info + chrome://gpu",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app, 2.2, 1.4, 3)
		scene.background = new Color("#10141c")
		temelIsik(scene)
		const backend = getBackendAdi(renderer)

		const halka = new Mesh(
			new TorusGeometry(0.7, 0.22, 16, 48),
			new MeshStandardNodeMaterial({
				color: "#7aa8ff",
				roughness: 0.25,
				metalness: 0.4
			})
		)
		scene.add(halka)

		const spector =
			backend === "WebGL 2"
				? ky("spectorWebgl")
				: ky("spectorWebgpu")

		istatistikEk.innerHTML = `
			<p>${ky("chromePanelYok")}</p>
			<p>${spector}</p>
			<p>${ky("inspectorEklenti")}</p>`

		kontrolHtml(
			kontroller,
			`<button id="tablo" type="button">renderer.info</button>
			<button id="backend" type="button">Backend yaz</button>
			<p>Araç: console + info + chrome://gpu</p>
			<p>Eski WebGPU flag önerme.</p>`
		)

		el<HTMLButtonElement>(kontroller, "#tablo")
			?.addEventListener("click", () => {
				consolaYazdir(renderer)
				console.info(
					"Spector.js WebGL içindir. WebGPU capture yok."
				)
			})

		el<HTMLButtonElement>(kontroller, "#backend")
			?.addEventListener("click", () => {
				console.info("backend", backend)
				console.info("navigator.gpu", navigator.gpu)
				if (backend === "WebGL 2") {
					console.info(
						"Fallback: Spector.js draw call / program / texture gösterebilir."
					)
					return
				}
				console.info(
					"WebGPU: Chrome panel yok. " +
						"WebGPU Inspector isteğe bağlı. " +
						"chrome://gpu kullan."
				)
			})

		return {
			update: () => {
				controls.update()
				halka.rotation.x += 0.006
				halka.rotation.y += 0.01
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

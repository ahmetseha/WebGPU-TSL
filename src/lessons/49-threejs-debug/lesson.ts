import {
	BoxGeometry,
	Color,
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import { consolaYazdir } from "@/utils/debug"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "49",
	no: "49",
	title: "Three.js debug",
	bolum: "Bölüm 24 — Three.js debug",
	akis: "renderer.info → Console.table → HUD alanları",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app, 2.6, 1.6, 3.4)
		scene.background = new Color("#151820")
		temelIsik(scene)

		const kutu = new Mesh(
			new BoxGeometry(0.9, 0.9, 0.9),
			new MeshStandardNodeMaterial({
				color: "#3ec5f1",
				roughness: 0.4
			})
		)
		const kure = new Mesh(
			new SphereGeometry(0.35, 16, 16),
			new MeshStandardNodeMaterial({
				color: "#ffcc33",
				roughness: 0.35
			})
		)
		kure.position.set(1.3, 0.1, 0)
		scene.add(kutu, kure)

		istatistikEk.innerHTML = `
			<p><strong>drawCalls</strong> ${ky("drawCallsKare")}</p>
			<p><strong>triangles</strong> ${ky("trianglesRaster")}</p>
			<p><strong>points / lines</strong> ${ky("pointsLines")}</p>
			<p><strong>frameCalls</strong> ${ky("frameCallsKare")}</p>
			<p><strong>calls</strong> ${ky("callsOmur")}</p>
			<p><strong>geometries / textures</strong> ${ky("geoTexBellek")}</p>
			<p><strong>compute.frameCalls</strong> compute</p>`

		kontrolHtml(
			kontroller,
			`<button id="tablo" type="button">console.table</button>
			<button id="info" type="button">info() log</button>
			<button id="ekle" type="button">Küre ekle</button>
			<button id="sil" type="button">Küre sil</button>`
		)

		const ekstra: Mesh[] = []

		el<HTMLButtonElement>(kontroller, "#tablo")
			?.addEventListener("click", () => {
				consolaYazdir(renderer)
			})

		el<HTMLButtonElement>(kontroller, "#info")
			?.addEventListener("click", () => {
				const { render, memory, compute } = renderer.info
				console.info("render.drawCalls", render.drawCalls)
				console.info("render.triangles", render.triangles)
				console.info("render.points", render.points)
				console.info("render.lines", render.lines)
				console.info("render.frameCalls", render.frameCalls)
				console.info("render.calls", render.calls)
				console.info("compute.frameCalls", compute.frameCalls)
				console.info("memory.geometries", memory.geometries)
				console.info("memory.textures", memory.textures)
			})

		el<HTMLButtonElement>(kontroller, "#ekle")
			?.addEventListener("click", () => {
				const kopya = new Mesh(
					kure.geometry,
					kure.material
				)
				kopya.position.set(
					1.3,
					ekstra.length * 0.45 + 0.55,
					0
				)
				ekstra.push(kopya)
				scene.add(kopya)
			})

		el<HTMLButtonElement>(kontroller, "#sil")
			?.addEventListener("click", () => {
				const son = ekstra.pop()
				if (son === undefined) {
					return
				}
				scene.remove(son)
			})

		return {
			update: () => {
				controls.update()
				kutu.rotation.y += 0.008
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

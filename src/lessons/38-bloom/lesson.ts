import {
	Color,
	Mesh,
	MeshBasicNodeMaterial,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	RenderPipeline,
	SphereGeometry
} from "three/webgpu"
import { pass, vec3, type TSLNode } from "three/tsl"
import { bloom } from "three/addons/tsl/display/BloomNode.js"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

type BloomDugumu = TSLNode & {
	strength: TSLNode
	threshold: TSLNode
	dispose: () => void
}

export const lesson: LessonModule = {
	id: "38",
	no: "38",
	title: "Bloom",
	bolum: "Bölüm 16 — Post Processing",
	akis: "HDR / emissive → eşik → blur → sahneye ekle",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, camera, renderer } = app
		const controls = kameraSifirla(app, 2.4, 1.3, 3.2)
		scene.background = new Color("#05060a")

		const parlakMat = new MeshStandardNodeMaterial()
		parlakMat.colorNode = vec3(0.15, 0.08, 0.04)
		parlakMat.emissiveNode = vec3(4.2, 2.1, 0.7)
		parlakMat.roughness = 0.35
		parlakMat.metalness = 0

		const matKure = new Mesh(
			new SphereGeometry(0.55, 32, 32),
			parlakMat
		)

		const sogukMat = new MeshStandardNodeMaterial()
		sogukMat.colorNode = vec3(0.08, 0.12, 0.2)
		sogukMat.emissiveNode = vec3(0.2, 0.55, 2.4)
		sogukMat.roughness = 0.3

		const soguk = new Mesh(
			new SphereGeometry(0.28, 24, 24),
			sogukMat
		)
		soguk.position.set(1.35, 0.05, 0.15)

		const karanlik = new Mesh(
			new SphereGeometry(0.4, 24, 24),
			new MeshBasicNodeMaterial({ color: "#1b1e26" })
		)
		karanlik.position.set(-1.25, 0, 0.1)

		const zemin = new Mesh(
			new PlaneGeometry(8, 8),
			new MeshBasicNodeMaterial({ color: "#0b0d12" })
		)
		zemin.rotation.x = -Math.PI / 2
		zemin.position.y = -0.55
		scene.add(matKure, soguk, karanlik, zemin)

		const scenePass = pass(scene, camera)
		const sahneRenk = scenePass.getTextureNode()
		const guc = 1.15
		const esik = 0.35
		const bloomPass = bloom(
			sahneRenk,
			guc,
			0.45,
			esik
		) as BloomDugumu
		const pipeline = new RenderPipeline(renderer)
		pipeline.outputNode = sahneRenk.add(bloomPass)

		kontrolHtml(
			kontroller,
			`<label>Güç
			<input id="guc" type="range" min="0"
			max="40" value="12" /></label>
			<label>Eşik
			<input id="esik" type="range" min="0"
			max="20" value="7" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#guc")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				bloomPass.strength.value =
					Number(hedef.value) / 10
			})

		el<HTMLInputElement>(kontroller, "#esik")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				bloomPass.threshold.value =
					Number(hedef.value) / 20
			})

		return {
			render: () => {
				pipeline.render()
			},
			update: () => {
				controls.update()
				matKure.rotation.y += 0.004
				istatistikEk.textContent =
					"emissive + bloom"
			},
			dispose: () => {
				controls.dispose()
				bloomPass.dispose()
				pipeline.dispose()
			}
		}
	}
}

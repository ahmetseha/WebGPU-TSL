import {
	Mesh,
	MeshBasicNodeMaterial,
	MeshPhysicalNodeMaterial,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import { color } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "23",
	no: "23",
	title: "Node materials",
	bolum: "Bölüm 9 — Material",
	akis: "Basic (unlit) / Standard (PBR) / Physical (clearcoat)",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 1.3, 5.4)
		temelIsik(scene)
		const ortak = color("#6eb6ff")

		const basic = new MeshBasicNodeMaterial()
		basic.colorNode = ortak

		const standard = new MeshStandardNodeMaterial({
			roughness: 0.35,
			metalness: 0.15
		})
		standard.colorNode = ortak

		const physical = new MeshPhysicalNodeMaterial({
			roughness: 0.18,
			metalness: 0.25,
			clearcoat: 1,
			clearcoatRoughness: 0.12
		})
		physical.colorNode = ortak

		const geo = new SphereGeometry(0.75, 48, 32)
		const a = new Mesh(geo, basic)
		const b = new Mesh(geo, standard)
		const c = new Mesh(geo, physical)
		a.position.x = -1.8
		c.position.x = 1.8
		scene.add(a, b, c)

		kontrolHtml(
			kontroller,
			`<button id="isik" type="button" class="aktif">
				Işık açık
			</button>
			<p>Sol Basic · orta Standard · sağ Physical</p>`
		)

		let isikAcik = true
		el<HTMLButtonElement>(kontroller, "#isik")
			?.addEventListener("click", (event) => {
				isikAcik = !isikAcik
				for (const nesne of scene.children) {
					const yogunluk = (
						nesne as { intensity?: number }
					).intensity
					if (typeof yogunluk === "number") {
						nesne.visible = isikAcik
					}
				}
				if (event.currentTarget instanceof HTMLElement) {
					event.currentTarget.classList.toggle(
						"aktif",
						isikAcik
					)
				}
			})

		return {
			update: (dt) => {
				controls.update()
				a.rotation.y += dt * 0.4
				b.rotation.y += dt * 0.4
				c.rotation.y += dt * 0.4
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

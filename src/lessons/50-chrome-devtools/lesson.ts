import {
	Color,
	DataTexture,
	Mesh,
	MeshBasicNodeMaterial,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	SphereGeometry
} from "three/webgpu"
import { texture } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

type Sizinti = {
	doku: DataTexture
	mesh: Mesh
	malzeme: MeshBasicNodeMaterial
}

export const lesson: LessonModule = {
	id: "50",
	no: "50",
	title: "Chrome DevTools",
	bolum: "Bölüm 25 — Chrome DevTools",
	akis: "Console → Performance 16.67ms → Memory → Network → Rendering",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.4, 1.5, 3.2)
		scene.background = new Color("#171b24")
		temelIsik(scene)

		const kure = new Mesh(
			new SphereGeometry(0.85, 24, 24),
			new MeshStandardNodeMaterial({
				color: "#6ec8e0",
				roughness: 0.3,
				metalness: 0.2
			})
		)
		scene.add(kure)

		const sizinti: Sizinti[] = []
		const sızdırGeo = new PlaneGeometry(0.18, 0.18)

		istatistikEk.innerHTML = `
			<p>1. Console: hatalar ve __egitim.info()</p>
			<p>2. Performance: kare &lt; 16.67 ms mi?</p>
			<p>3. Memory: sızdır / temizle</p>
			<p>4. Network: ağır asset yok — ne aranır?</p>
			<p>5. Rendering: FPS meter, paint flashing</p>`

		kontrolHtml(
			kontroller,
			`<button id="log" type="button">Console log</button>
			<button id="sizdir" type="button">Doku sızdır</button>
			<button id="temizle" type="button">Doku dispose</button>
			<p>chrome://gpu açık — eski WebGPU flag yok.</p>`
		)

		el<HTMLButtonElement>(kontroller, "#log")
			?.addEventListener("click", () => {
				console.info("Ders 50 — Console")
				console.info(
					"Hata: kırmızı. Uyarı: sarı. WebGPU doğrulama da burada."
				)
				console.info(window)
			})

		el<HTMLButtonElement>(kontroller, "#sizdir")
			?.addEventListener("click", () => {
				for (let i = 0; i < 6; i += 1) {
					const data = new Uint8Array(128 * 128 * 4)
					data.fill(40 + i * 20)
					const doku = new DataTexture(data, 128, 128)
					doku.needsUpdate = true
					const malzeme = new MeshBasicNodeMaterial()
					malzeme.colorNode = texture(doku)
					const mesh = new Mesh(sızdırGeo, malzeme)
					mesh.position.set(
						1.5,
						sizinti.length * 0.2 - 0.5,
						0
					)
					scene.add(mesh)
					sizinti.push({ doku, mesh, malzeme })
				}
				console.warn(
					`Sızıntı: ${String(sizinti.length)} doku sahnede. HUD textures artar.`
				)
			})

		el<HTMLButtonElement>(kontroller, "#temizle")
			?.addEventListener("click", () => {
				for (const parca of sizinti) {
					scene.remove(parca.mesh)
					parca.malzeme.dispose()
					parca.doku.dispose()
				}
				sizinti.length = 0
				console.info("Doku dispose — textures düşmeli")
			})

		return {
			update: () => {
				controls.update()
				kure.rotation.y += 0.01
				kure.rotation.x += 0.004
			},
			dispose: () => {
				for (const parca of sizinti) {
					scene.remove(parca.mesh)
					parca.malzeme.dispose()
					parca.doku.dispose()
				}
				sızdırGeo.dispose()
				sizinti.length = 0
				controls.dispose()
			}
		}
	}
}

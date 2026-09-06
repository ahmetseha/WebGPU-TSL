import {
	BoxGeometry,
	Mesh,
	MeshBasicNodeMaterial
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "03",
	no: "03",
	title: "WebGPURenderer",
	bolum: "Bölüm 1 — GPU ve WebGPU temelleri",
	akis: "init() → setPixelRatio → loop → render(scene, camera)",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app)
		const baslangic = Math.min(
			window.devicePixelRatio,
			2
		)
		let oran = baslangic

		const kup = new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshBasicNodeMaterial({ color: "#3ec5f1" })
		)
		scene.add(kup)

		const ozet = (): void => {
			const { backend } = renderer
			const gpu = backend.isWebGPUBackend === true
			istatistikEk.textContent =
				`isWebGPUBackend=${String(gpu)} · ` +
				`pixelRatio=${oran.toFixed(2)}`
		}

		const uygula = (yeni: number): void => {
			oran = yeni
			renderer.setPixelRatio(oran)
			renderer.setSize(
				window.innerWidth,
				window.innerHeight
			)
			ozet()
		}

		kontrolHtml(
			kontroller,
			`<label>Pixel ratio
				<input id="pr" type="range"
					min="0.5" max="2" step="0.1"
					value="${String(oran)}" />
			</label>
			<button id="yarim" type="button">0.5</button>
			<button id="bir" type="button">1</button>
			<button id="iki" type="button">2</button>`
		)

		ozet()

		el<HTMLInputElement>(kontroller, "#pr")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uygula(Number(hedef.value))
			})

		const kaydir = el<HTMLInputElement>(
			kontroller,
			"#pr"
		)

		const atla = (deger: number): void => {
			if (kaydir !== null) {
				kaydir.value = String(deger)
			}
			uygula(deger)
		}

		el<HTMLButtonElement>(kontroller, "#yarim")
			?.addEventListener("click", () => {
				atla(0.5)
			})
		el<HTMLButtonElement>(kontroller, "#bir")
			?.addEventListener("click", () => {
				atla(1)
			})
		el<HTMLButtonElement>(kontroller, "#iki")
			?.addEventListener("click", () => {
				atla(2)
			})

		return {
			update: () => {
				controls.update()
				kup.rotation.y += 0.01
			},
			dispose: () => {
				uygula(baslangic)
				controls.dispose()
			}
		}
	}
}

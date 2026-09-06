import {
	Color,
	Mesh,
	MeshBasicNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import { sin, time, uniform } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "10",
	no: "10",
	title: "Uniform",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "JS uniform.value → bind group → shader",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app)
		const renkDeger = new Color("#3ec5f1")
		const uRenk = uniform(renkDeger)
		const uHiz = uniform(1)
		const uGuc = uniform(1)

		const nabiz = sin(time.mul(uHiz))
			.mul(0.2)
			.add(0.8)
		const material = new MeshBasicNodeMaterial()
		material.colorNode = uRenk.mul(uGuc).mul(nabiz)

		const kure = new Mesh(
			new SphereGeometry(1, 48, 32),
			material
		)
		scene.add(kure)

		kontrolHtml(
			kontroller,
			`<label>Hız
				<input id="hiz" type="range"
					min="0" max="4" step="0.1" value="1" />
			</label>
			<label>Renk
				<input id="renk" type="range"
					min="0" max="1" step="0.01"
					value="0.25" />
			</label>
			<label>Güç
				<input id="guc" type="range"
					min="0" max="2" step="0.05" value="1" />
			</label>`
		)

		const rengiKur = (t: number): void => {
			renkDeger.r = 0.24 + t * 0.76
			renkDeger.g = 0.77 - t * 0.4
			renkDeger.b = 0.94 - t * 0.62
		}

		rengiKur(0.25)

		el<HTMLInputElement>(kontroller, "#hiz")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uHiz.value = Number(hedef.value)
			})

		el<HTMLInputElement>(kontroller, "#renk")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				rengiKur(Number(hedef.value))
			})

		el<HTMLInputElement>(kontroller, "#guc")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uGuc.value = Number(hedef.value)
			})

		return {
			update: () => {
				controls.update()
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

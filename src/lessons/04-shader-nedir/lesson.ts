import {
	Mesh,
	MeshBasicNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	normalLocal,
	positionLocal,
	sin,
	time,
	uniform,
	uv,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "04",
	no: "04",
	title: "Shader nedir?",
	bolum: "Bölüm 2 — Shader düşüncesi",
	akis: "Vertex → Interpolasyon → Fragment → Piksel",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app)
		const uNabiz = uniform(0.07)

		const material = new MeshBasicNodeMaterial()
		material.colorNode = vec3(uv().x, uv().y, 0.4)
		material.positionNode = positionLocal.add(
			normalLocal.mul(sin(time.mul(3)).mul(uNabiz))
		)

		const kure = new Mesh(
			new SphereGeometry(1, 48, 32),
			material
		)
		scene.add(kure)

		kontrolHtml(
			kontroller,
			`<label>Nabız
				<input id="nabiz" type="range"
					min="0" max="0.2" step="0.01"
					value="0.07" />
			</label>`
		)

		el<HTMLInputElement>(kontroller, "#nabiz")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uNabiz.value = Number(hedef.value)
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

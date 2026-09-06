import {
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	color,
	mix,
	positionLocal,
	sin,
	uniform,
	vec3,
	type TSLNode
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

function sayiBagla(
	kok: HTMLElement,
	secici: string,
	hedef: TSLNode
): void {
	el<HTMLInputElement>(kok, secici)
		?.addEventListener("input", (event) => {
			const girdi = event.target
			if (!(girdi instanceof HTMLInputElement)) {
				return
			}
			hedef.value = Number(girdi.value)
		})
}

function aktifMod(
	kok: HTMLElement,
	aktifId: string
): void {
	for (const id of ["taban", "kaydir"]) {
		el<HTMLButtonElement>(kok, `#${id}`)
			?.classList.toggle("aktif", id === aktifId)
	}
}

export const lesson: LessonModule = {
	id: "20",
	no: "20",
	title: "Position nodes",
	bolum: "Bölüm 8 — Vertex manipulation",
	akis: "positionLocal → + offset → vertex clip space",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.2, 1.4, 2.8)
		temelIsik(scene)
		const ofset = uniform(0)
		const debug = uniform(0)
		const dalga = sin(positionLocal.x.mul(5)).mul(ofset)
		const material = new MeshStandardNodeMaterial()
		material.positionNode = positionLocal.add(
			vec3(0, dalga, 0)
		)
		material.colorNode = mix(
			color("#5aa7d4"),
			positionLocal.mul(0.5).add(0.5),
			debug
		)
		material.roughness = 0.45
		material.metalness = 0.05

		const mesh = new Mesh(
			new SphereGeometry(1, 64, 48),
			material
		)
		scene.add(mesh)

		kontrolHtml(
			kontroller,
			`<label>Offset
				<input id="ofset" type="range" min="0" max="0.45"
					step="0.01" value="0" />
			</label>
			<button id="taban" type="button" class="aktif">
				positionLocal
			</button>
			<button id="kaydir" type="button">+ offset</button>
			<button id="debug" type="button">
				positionLocal renk
			</button>`
		)

		sayiBagla(kontroller, "#ofset", ofset)

		el<HTMLButtonElement>(kontroller, "#taban")
			?.addEventListener("click", () => {
				ofset.value = 0
				const kaydir = el<HTMLInputElement>(
					kontroller,
					"#ofset"
				)
				if (kaydir !== null) {
					kaydir.value = "0"
				}
				aktifMod(kontroller, "taban")
			})

		el<HTMLButtonElement>(kontroller, "#kaydir")
			?.addEventListener("click", () => {
				if (Number(ofset.value) === 0) {
					ofset.value = 0.22
					const kaydir = el<HTMLInputElement>(
						kontroller,
						"#ofset"
					)
					if (kaydir !== null) {
						kaydir.value = "0.22"
					}
				}
				aktifMod(kontroller, "kaydir")
			})

		el<HTMLButtonElement>(kontroller, "#debug")
			?.addEventListener("click", (event) => {
				debug.value =
					Number(debug.value) === 1 ? 0 : 1
				if (event.currentTarget instanceof HTMLElement) {
					event.currentTarget.classList.toggle(
						"aktif",
						Number(debug.value) === 1
					)
				}
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

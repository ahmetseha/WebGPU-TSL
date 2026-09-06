import {
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	color,
	cos,
	mix,
	normalLocal,
	normalView,
	positionLocal,
	sin,
	time,
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

export const lesson: LessonModule = {
	id: "22",
	no: "22",
	title: "Normal",
	bolum: "Bölüm 8 — Vertex manipulation",
	akis: "displace vertex → eski normal kırık / yaklaşık normal",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 1.2, 5)
		temelIsik(scene)
		const amp = uniform(0.14)
		const freq = uniform(6)
		const debug = uniform(0)
		const h = sin(
			positionLocal.x.mul(freq).add(time)
		).mul(amp)
		const pos = positionLocal.add(normalLocal.mul(h))
		const nYaklasik = normalView.add(
			vec3(
				cos(positionLocal.x.mul(freq).add(time))
					.mul(amp)
					.mul(freq),
				0,
				0
			)
		)

		const kirik = new MeshStandardNodeMaterial({
			color: "#8fb4d4"
		})
		kirik.positionNode = pos
		kirik.colorNode = mix(
			color("#d46a6a"),
			normalView.mul(0.5).add(0.5),
			debug
		)
		kirik.roughness = 0.35

		const duzelt = new MeshStandardNodeMaterial({
			color: "#6aaed4"
		})
		duzelt.positionNode = pos
		duzelt.normalNode = nYaklasik
		duzelt.colorNode = mix(
			color("#6ad4a0"),
			normalView.mul(0.5).add(0.5),
			debug
		)
		duzelt.roughness = 0.35

		const sol = new Mesh(
			new SphereGeometry(0.95, 64, 48),
			kirik
		)
		const sag = new Mesh(
			new SphereGeometry(0.95, 64, 48),
			duzelt
		)
		sol.position.x = -1.25
		sag.position.x = 1.25
		scene.add(sol, sag)

		kontrolHtml(
			kontroller,
			`<label>Genlik
				<input id="amp" type="range" min="0" max="0.28"
					step="0.01" value="0.14" />
			</label>
			<label>Frekans
				<input id="freq" type="range" min="2" max="12"
					step="0.25" value="6" />
			</label>
			<button id="debug" type="button">
				normalView renk
			</button>`
		)

		sayiBagla(kontroller, "#amp", amp)
		sayiBagla(kontroller, "#freq", freq)

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

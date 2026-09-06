import {
	Mesh,
	MeshBasicNodeMaterial,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	SphereGeometry
} from "three/webgpu"
import {
	color,
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
	id: "24",
	no: "24",
	title: "Material nodes",
	bolum: "Bölüm 9 — Material",
	akis: "slider → uniform → color / roughness / metalness / emissive / opacity",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.2, 1.5, 2.8)
		temelIsik(scene)
		const r = uniform(0.28)
		const g = uniform(0.72)
		const b = uniform(0.88)
		const purluk = uniform(0.4)
		const metal = uniform(0.15)
		const emisyon = uniform(0)
		const saydam = uniform(1)

		const material = new MeshStandardNodeMaterial()
		material.colorNode = vec3(r, g, b)
		material.roughnessNode = purluk
		material.metalnessNode = metal
		material.emissiveNode = color("#ff8844").mul(emisyon)
		material.opacityNode = saydam
		material.transparent = true

		const mesh = new Mesh(
			new SphereGeometry(1, 48, 32),
			material
		)
		const zemin = new Mesh(
			new PlaneGeometry(4, 4),
			new MeshBasicNodeMaterial({
				color: "#2a3344"
			})
		)
		zemin.position.z = -1.4
		scene.add(zemin, mesh)

		kontrolHtml(
			kontroller,
			`<label>R
				<input id="r" type="range" min="0" max="1"
					step="0.01" value="0.28" />
			</label>
			<label>G
				<input id="g" type="range" min="0" max="1"
					step="0.01" value="0.72" />
			</label>
			<label>B
				<input id="b" type="range" min="0" max="1"
					step="0.01" value="0.88" />
			</label>
			<label>Roughness
				<input id="purluk" type="range" min="0" max="1"
					step="0.01" value="0.4" />
			</label>
			<label>Metalness
				<input id="metal" type="range" min="0" max="1"
					step="0.01" value="0.15" />
			</label>
			<label>Emissive
				<input id="emisyon" type="range" min="0" max="2"
					step="0.01" value="0" />
			</label>
			<label>Opacity
				<input id="saydam" type="range" min="0.05" max="1"
					step="0.01" value="1" />
			</label>`
		)

		sayiBagla(kontroller, "#r", r)
		sayiBagla(kontroller, "#g", g)
		sayiBagla(kontroller, "#b", b)
		sayiBagla(kontroller, "#purluk", purluk)
		sayiBagla(kontroller, "#metal", metal)
		sayiBagla(kontroller, "#emisyon", emisyon)
		sayiBagla(kontroller, "#saydam", saydam)

		return {
			update: (dt) => {
				controls.update()
				mesh.rotation.y += dt * 0.35
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

import {
	BoxGeometry,
	Euler,
	InstancedMesh,
	Matrix4,
	MeshStandardNodeMaterial,
	Quaternion,
	Vector3
} from "three/webgpu"
import {
	Fn,
	hash,
	instanceIndex,
	positionLocal,
	sin,
	time,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

const AZAMI = 1600

function yerlestir(yigin: InstancedMesh): void {
	const konum = new Vector3()
	const euler = new Euler()
	const quat = new Quaternion()
	const olcek = new Vector3(1, 1, 1)
	const matris = new Matrix4()
	const kenar = Math.ceil(Math.cbrt(AZAMI))

	for (let i = 0; i < AZAMI; i++) {
		const x = (i % kenar) - kenar / 2
		const y =
			(Math.floor(i / kenar) % kenar) - kenar / 2
		const z =
			Math.floor(i / (kenar * kenar)) - kenar / 2
		konum.set(x * 0.62, y * 0.62, z * 0.62)
		euler.set(0, 0, 0)
		quat.setFromEuler(euler)
		matris.compose(konum, quat, olcek)
		yigin.setMatrixAt(i, matris)
	}

	yigin.instanceMatrix.needsUpdate = true
}

export const lesson: LessonModule = {
	id: "35",
	no: "35",
	title: "TSL + Instances",
	bolum: "Bölüm 15 — Instancing",
	akis: "setMatrixAt + sin(time + instanceIndex)",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 7, 5.8, 8)
		temelIsik(scene)
		let adet = 900

		const konumNode = Fn(() => {
			const dalga = sin(
				time.add(instanceIndex.mul(0.13))
			).mul(0.38)
			return positionLocal.add(vec3(0, dalga, 0))
		})

		const renkNode = Fn(() => {
			const i = instanceIndex
			return vec3(
				hash(i),
				hash(i.add(17)).mul(0.7).add(0.2),
				hash(i.add(31))
			)
		})

		const geo = new BoxGeometry(0.3, 0.3, 0.3)
		const malzeme = new MeshStandardNodeMaterial()
		malzeme.positionNode = konumNode()
		malzeme.colorNode = renkNode()
		malzeme.roughness = 0.4
		malzeme.metalness = 0.15

		const yigin = new InstancedMesh(geo, malzeme, AZAMI)
		yerlestir(yigin)
		yigin.count = adet
		scene.add(yigin)

		kontrolHtml(
			kontroller,
			`<label>Adet
			<input id="adet" type="range" min="40"
			max="${AZAMI}" value="${adet}" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#adet")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				adet = Number(hedef.value)
				yigin.count = adet
			})

		return {
			update: () => {
				controls.update()
				istatistikEk.textContent =
					`${adet} instance · GPU dalga`
			},
			dispose: () => {
				controls.dispose()
				malzeme.dispose()
				geo.dispose()
			}
		}
	}
}

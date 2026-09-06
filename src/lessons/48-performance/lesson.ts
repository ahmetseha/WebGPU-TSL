import {
	Color,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry,
	Vector3
} from "three/webgpu"
import {
	mx_noise_float,
	positionWorld,
	time,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

const ADET = 180

export const lesson: LessonModule = {
	id: "48",
	no: "48",
	title: "Performans",
	bolum: "Bölüm 23 — Performance",
	akis: "draw call × üçgen × shader × bellek → kare süresi",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 4.4, 2.6, 6.2)
		scene.background = new Color("#12151c")
		temelIsik(scene)

		let instanced = true
		let yuksek = false
		let pahali = false
		const nesneler: Mesh[] = []
		let geo = new SphereGeometry(0.16, 8, 8)
		let mat = ucuzMat()

		const kur = (): void => {
			for (const n of nesneler) {
				scene.remove(n)
			}
			nesneler.length = 0
			geo.dispose()
			mat.dispose()
			const seg = yuksek ? 32 : 8
			geo = new SphereGeometry(0.16, seg, seg)
			mat = pahali ? pahaliMat() : ucuzMat()
			const matris = new Matrix4()
			const pos = new Vector3()
			if (instanced) {
				const yigin = new InstancedMesh(geo, mat, ADET)
				for (let i = 0; i < ADET; i += 1) {
					pos.set(
						(i % 12) * 0.42 - 2.3,
						Math.floor(i / 12) * 0.42 - 2.2,
						0
					)
					matris.compose(
						pos,
						{ x: 0, y: 0, z: 0, w: 1 },
						new Vector3(1, 1, 1)
					)
					yigin.setMatrixAt(i, matris)
				}
				scene.add(yigin)
				nesneler.push(yigin)
				return
			}
			for (let i = 0; i < ADET; i += 1) {
				const mesh = new Mesh(geo, mat)
				mesh.position.set(
					(i % 12) * 0.42 - 2.3,
					Math.floor(i / 12) * 0.42 - 2.2,
					0
				)
				scene.add(mesh)
				nesneler.push(mesh)
			}
		}

		kur()

		istatistikEk.innerHTML =
			`<p>${ky("fpsYetmez")}</p>
			<p>${ky("cpuGpu")}</p>`

		kontrolHtml(
			kontroller,
			`<button id="inst" type="button" class="aktif">InstancedMesh</button>
			<button id="ayri" type="button">Ayrı Mesh</button>
			<button id="seg" type="button">Segment düşük</button>
			<button id="shader" type="button">Shader ucuz</button>`
		)

		const instBtn = el<HTMLButtonElement>(kontroller, "#inst")
		const ayriBtn = el<HTMLButtonElement>(kontroller, "#ayri")
		const segBtn = el<HTMLButtonElement>(kontroller, "#seg")
		const shBtn = el<HTMLButtonElement>(kontroller, "#shader")

		instBtn?.addEventListener("click", () => {
			instanced = true
			instBtn.classList.add("aktif")
			ayriBtn?.classList.remove("aktif")
			kur()
		})
		ayriBtn?.addEventListener("click", () => {
			instanced = false
			ayriBtn.classList.add("aktif")
			instBtn?.classList.remove("aktif")
			kur()
		})
		segBtn?.addEventListener("click", () => {
			yuksek = !yuksek
			if (segBtn !== null) {
				segBtn.textContent = yuksek
					? ky("segYuksek")
					: ky("segDusuk")
				segBtn.classList.toggle("aktif", yuksek)
			}
			kur()
		})
		shBtn?.addEventListener("click", () => {
			pahali = !pahali
			if (shBtn !== null) {
				shBtn.textContent = pahali
					? ky("shaderPahali")
					: ky("shaderUcuz")
				shBtn.classList.toggle("aktif", pahali)
			}
			kur()
		})

		return {
			update: () => {
				controls.update()
			},
			dispose: () => {
				for (const n of nesneler) {
					scene.remove(n)
				}
				geo.dispose()
				mat.dispose()
				controls.dispose()
			}
		}
	}
}

function ucuzMat(): MeshStandardNodeMaterial {
	return new MeshStandardNodeMaterial({
		color: "#4aa3c7",
		roughness: 0.45
	})
}

function pahaliMat(): MeshStandardNodeMaterial {
	const mat = new MeshStandardNodeMaterial({
		roughness: 0.35
	})
	const n = mx_noise_float(
		positionWorld.mul(4).add(time)
	)
		.add(mx_noise_float(positionWorld.mul(9).add(time.mul(0.4))))
		.add(mx_noise_float(positionWorld.mul(18)))
	mat.colorNode = vec3(n, n.mul(0.45), n.mul(0.75))
	return mat
}

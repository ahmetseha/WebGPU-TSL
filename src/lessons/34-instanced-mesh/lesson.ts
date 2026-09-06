import {
	BoxGeometry,
	Color,
	Euler,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardNodeMaterial,
	Quaternion,
	Vector3
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

const AZAMI = 2000

function matrisDoldur(
	yigin: InstancedMesh,
	adet: number
): void {
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
		konum.set(x * 0.55, y * 0.55, z * 0.55)
		euler.set(0, i * 0.07, 0)
		quat.setFromEuler(euler)
		matris.compose(konum, quat, olcek)
		yigin.setMatrixAt(i, matris)
	}

	yigin.instanceMatrix.needsUpdate = true
	yigin.count = adet
}

export const lesson: LessonModule = {
	id: "34",
	no: "34",
	title: "InstancedMesh",
	bolum: "Bölüm 15 — Instancing",
	akis: "1 geo + 1 mat + N matris → 1 draw call",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 8, 6.5, 9)
		temelIsik(scene)
		let adet = 800
		let ayriMod = false
		const ayri: Mesh[] = []

		const geo = new BoxGeometry(0.28, 0.28, 0.28)
		const malzeme = new MeshStandardNodeMaterial({
			color: "#3ec5f1"
		})
		malzeme.roughness = 0.45
		malzeme.metalness = 0.1

		const yigin = new InstancedMesh(geo, malzeme, AZAMI)
		matrisDoldur(yigin, adet)
		scene.add(yigin)

		kontrolHtml(
			kontroller,
			`<label>Adet
			<input id="adet" type="range" min="50"
			max="${AZAMI}" value="${adet}" /></label>
			<button id="ayri" type="button">
			2000 ayrı Mesh</button>`
		)

		const ayriTemizle = (): void => {
			for (const mesh of ayri) {
				scene.remove(mesh)
				mesh.material.dispose()
			}
			ayri.length = 0
		}

		const ayriKur = (): void => {
			ayriTemizle()
			const kenar = Math.ceil(Math.cbrt(adet))
			for (let i = 0; i < adet; i++) {
				const mesh = new Mesh(
					geo,
					new MeshStandardNodeMaterial({
						color: new Color("#ff8844")
					})
				)
				const x = (i % kenar) - kenar / 2
				const y =
					(Math.floor(i / kenar) % kenar) -
					kenar / 2
				const z =
					Math.floor(i / (kenar * kenar)) -
					kenar / 2
				mesh.position.set(
					x * 0.55,
					y * 0.55,
					z * 0.55
				)
				ayri.push(mesh)
				scene.add(mesh)
			}
		}

		el<HTMLInputElement>(kontroller, "#adet")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				adet = Number(hedef.value)
				yigin.count = adet
				if (ayriMod) {
					ayriKur()
				}
			})

		el<HTMLButtonElement>(kontroller, "#ayri")
			?.addEventListener("click", (event) => {
				ayriMod = !ayriMod
				yigin.visible = !ayriMod
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.toggle(
						"aktif",
						ayriMod
					)
				if (ayriMod) {
					ayriKur()
				} else {
					ayriTemizle()
				}
			})

		return {
			update: () => {
				controls.update()
				istatistikEk.textContent = ayriMod
					? ky("ayriMeshN", { n: adet })
					: ky("instanceBir", { n: adet })
			},
			dispose: () => {
				ayriTemizle()
				controls.dispose()
				malzeme.dispose()
				geo.dispose()
			}
		}
	}
}

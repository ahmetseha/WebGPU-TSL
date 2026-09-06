import {
	GridHelper,
	Mesh,
	MeshBasicNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	clamp,
	mix,
	positionLocal,
	positionView,
	positionWorld,
	uniform
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"


export const lesson: LessonModule = {
	id: "05",
	no: "05",
	title: "Koordinat sistemleri",
	bolum: "Bölüm 2 — Shader düşüncesi",
	akis: "Local → World → View → Clip → NDC → Screen",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 3.2, 2.2, 4.2)
		const uAlan = uniform(0)
		let zaman = 0

		const yerel = positionLocal.mul(0.5).add(0.5)
		const dunya = positionWorld.mul(0.25).add(0.5)
		const bakis = positionView.mul(0.2).add(0.5)
		const ara = mix(yerel, dunya, clamp(uAlan, 0, 1))
		const renk = mix(
			ara,
			bakis,
			clamp(uAlan.sub(1), 0, 1)
		)

		const material = new MeshBasicNodeMaterial()
		material.colorNode = renk

		const kure = new Mesh(
			new SphereGeometry(0.75, 32, 24),
			material
		)
		kure.position.set(1.4, 0.5, 0)
		scene.add(kure)

		const koken = new Mesh(
			new SphereGeometry(0.08, 12, 10),
			new MeshBasicNodeMaterial({ color: "#ffcc33" })
		)
		scene.add(koken)
		scene.add(
			new GridHelper(8, 16, "#3ec5f1", "#2a313c")
		)

		const etiket = (v: number): string => {
			if (v < 0.5) return "local"
			if (v < 1.5) return "world"
			return "view"
		}

		const yaz = (v: number): void => {
			istatistikEk.textContent =
				`${ky("uzay")} ~ ${etiket(v)} (${v.toFixed(2)})`
		}

		kontrolHtml(
			kontroller,
			`<label>Uzay
				<input id="uzay" type="range"
					min="0" max="2" step="0.01" value="0" />
			</label>
			<button id="local" type="button" class="aktif">
				Local
			</button>
			<button id="world" type="button">World</button>
			<button id="view" type="button">View</button>`
		)

		yaz(0)

		const kaydir = el<HTMLInputElement>(
			kontroller,
			"#uzay"
		)

		const kur = (v: number): void => {
			uAlan.value = v
			if (kaydir !== null) kaydir.value = String(v)
			yaz(v)
			el(kontroller, "#local")?.classList.toggle(
				"aktif",
				v < 0.5
			)
			el(kontroller, "#world")?.classList.toggle(
				"aktif",
				v >= 0.5 && v < 1.5
			)
			el(kontroller, "#view")?.classList.toggle(
				"aktif",
				v >= 1.5
			)
		}

		kaydir?.addEventListener("input", (event) => {
			const hedef = event.target
			if (!(hedef instanceof HTMLInputElement)) return
			kur(Number(hedef.value))
		})

		el<HTMLButtonElement>(kontroller, "#local")
			?.addEventListener("click", () => {
				kur(0)
			})
		el<HTMLButtonElement>(kontroller, "#world")
			?.addEventListener("click", () => {
				kur(1)
			})
		el<HTMLButtonElement>(kontroller, "#view")
			?.addEventListener("click", () => {
				kur(2)
			})

		return {
			update: (dt) => {
				zaman += dt
				kure.position.x = Math.sin(zaman) * 1.5
				kure.position.y = 0.5
				kure.rotation.y += 0.006
				controls.update()
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

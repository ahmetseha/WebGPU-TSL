import {
	BoxGeometry,
	DoubleSide,
	Mesh,
	MeshBasicNodeMaterial,
	PlaneGeometry
} from "three/webgpu"
import {
	clamp,
	mix,
	positionLocal,
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
	id: "07",
	no: "07",
	title: "TSL veri tipleri",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "float / vec2 / vec3 / vec4 → GPU register",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0.2, 0.4, 4.4)
		const uTip = uniform(1)
		const u = uv()
		const skaler = vec3(u.x, u.x, u.x)
		const rg = vec3(u.x, u.y, 0)
		const rgb = vec3(u.x, u.y, 0.35)
		const ara = mix(skaler, rg, clamp(uTip, 0, 1))
		const duzlemRenk = mix(
			ara,
			rgb,
			clamp(uTip.sub(1), 0, 1)
		)

		const duzlemMat = new MeshBasicNodeMaterial()
		duzlemMat.colorNode = duzlemRenk
		duzlemMat.side = DoubleSide

		const duzlem = new Mesh(
			new PlaneGeometry(1.8, 1.8),
			duzlemMat
		)
		duzlem.position.set(-1.35, 0, 0)
		scene.add(duzlem)

		const kupMat = new MeshBasicNodeMaterial()
		kupMat.colorNode = positionLocal.mul(0.5).add(0.5)

		const kup = new Mesh(
			new BoxGeometry(1.1, 1.1, 1.1),
			kupMat
		)
		kup.position.set(1.35, 0, 0)
		scene.add(kup)

		kontrolHtml(
			kontroller,
			`<button id="f" type="button">float</button>
			<button id="v2" type="button" class="aktif">
				vec2
			</button>
			<button id="v3" type="button">vec3</button>`
		)

		istatistikEk.textContent =
			"sol: tip · sağ: vec3 positionLocal"

		const kur = (v: number, id: string): void => {
			uTip.value = v
			el(kontroller, "#f")?.classList.toggle(
				"aktif",
				id === "f"
			)
			el(kontroller, "#v2")?.classList.toggle(
				"aktif",
				id === "v2"
			)
			el(kontroller, "#v3")?.classList.toggle(
				"aktif",
				id === "v3"
			)
		}

		el<HTMLButtonElement>(kontroller, "#f")
			?.addEventListener("click", () => {
				kur(0, "f")
			})
		el<HTMLButtonElement>(kontroller, "#v2")
			?.addEventListener("click", () => {
				kur(1, "v2")
			})
		el<HTMLButtonElement>(kontroller, "#v3")
			?.addEventListener("click", () => {
				kur(2, "v3")
			})

		return {
			update: () => {
				controls.update()
				kup.rotation.y += 0.01
				kup.rotation.x += 0.004
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

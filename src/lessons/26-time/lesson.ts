import {
	BoxGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry,
	TorusGeometry
} from "three/webgpu"
import {
	color,
	mix,
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
import { ky } from "@/i18n/kontrol"
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
	id: "26",
	no: "26",
	title: "Time",
	bolum: "Bölüm 11 — Procedural animation",
	akis: "time * hız → sin → scale / renk / konum",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 1.5, 5.2)
		temelIsik(scene)
		const hiz = uniform(1)
		const t = time.mul(hiz)
		const s = sin(t)

		const olcekMat = new MeshStandardNodeMaterial({
			color: "#3ec5f1"
		})
		olcekMat.positionNode = positionLocal.mul(
			s.mul(0.22).add(1)
		)
		olcekMat.roughness = 0.4

		const renkMat = new MeshStandardNodeMaterial()
		renkMat.colorNode = mix(
			color("#3ec5f1"),
			color("#ffcc33"),
			s.mul(0.5).add(0.5)
		)
		renkMat.roughness = 0.35

		const konumMat = new MeshStandardNodeMaterial({
			color: "#d46ad4"
		})
		konumMat.positionNode = positionLocal.add(
			vec3(0, s.mul(0.45), 0)
		)
		konumMat.roughness = 0.4

		const kure = new Mesh(
			new SphereGeometry(0.45, 32, 24),
			olcekMat
		)
		const kutu = new Mesh(
			new BoxGeometry(0.7, 0.7, 0.7),
			renkMat
		)
		const halka = new Mesh(
			new TorusGeometry(0.38, 0.12, 16, 48),
			konumMat
		)
		kure.position.x = -1.7
		halka.position.x = 1.7
		scene.add(kure, kutu, halka)

		kontrolHtml(
			kontroller,
			`<label>Hız
				<input id="hiz" type="range" min="0" max="4"
					step="0.05" value="1" />
			</label>
			<p>${ky("solOlcek")}</p>`
		)

		sayiBagla(kontroller, "#hiz", hiz)

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

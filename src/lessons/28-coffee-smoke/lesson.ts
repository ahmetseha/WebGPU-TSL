import {
	CircleGeometry,
	CylinderGeometry,
	DoubleSide,
	Mesh,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	TorusGeometry
} from "three/webgpu"
import {
	color,
	mix,
	mx_noise_float,
	smoothstep,
	time,
	uniform,
	uv,
	vec2,
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
	id: "28",
	no: "28",
	title: "Kahve dumanı",
	bolum: "Bölüm 12 — Kahve dumanı",
	akis: "kupa + kenar + plane: noise + UV scroll + alpha mask",
	notes,
	start({ app, kontroller }) {
		const { scene, camera } = app
		const controls = kameraSifirla(app, 1.5, 1.15, 2.5)
		controls.target.set(0, 0.45, 0)
		controls.update()
		temelIsik(scene)

		const yogunluk = uniform(0.85)
		const hiz = uniform(0.22)
		const kayan = uv().add(
			vec2(
				mx_noise_float(
					uv().mul(3).add(time.mul(0.15))
				).mul(0.12),
				time.mul(hiz).negate()
			)
		)
		const n = mx_noise_float(kayan.mul(4), 0.5, 0.5)
		const kenarX = smoothstep(0, 0.18, uv().x).mul(
			smoothstep(1, 0.82, uv().x)
		)
		const kenarY = smoothstep(0, 0.04, uv().y).mul(
			smoothstep(1, 0.32, uv().y)
		)
		const alpha = n
			.mul(kenarX)
			.mul(kenarY)
			.mul(yogunluk)

		const kupaMat = new MeshStandardNodeMaterial({
			color: "#6b3a2a",
			roughness: 0.55,
			metalness: 0.05
		})
		const kahveMat = new MeshStandardNodeMaterial({
			color: "#2a140c",
			roughness: 0.3
		})
		const dumanMat = new MeshStandardNodeMaterial()
		dumanMat.colorNode = mix(
			vec3(0.55, 0.52, 0.5),
			color("#f4f1ea"),
			n
		)
		dumanMat.opacityNode = alpha
		dumanMat.transparent = true
		dumanMat.depthWrite = false
		dumanMat.side = DoubleSide
		dumanMat.roughness = 1

		const kupa = new Mesh(
			new CylinderGeometry(0.32, 0.26, 0.42, 32),
			kupaMat
		)
		kupa.position.y = 0.21
		const kenar = new Mesh(
			new TorusGeometry(0.32, 0.03, 12, 32),
			kupaMat
		)
		kenar.position.y = 0.42
		kenar.rotation.x = Math.PI / 2
		const kulp = new Mesh(
			new TorusGeometry(0.12, 0.028, 10, 24),
			kupaMat
		)
		kulp.position.set(0.4, 0.22, 0)
		kulp.rotation.y = Math.PI / 2
		const kahve = new Mesh(
			new CircleGeometry(0.275, 32),
			kahveMat
		)
		kahve.position.y = 0.4
		kahve.rotation.x = -Math.PI / 2
		const duman = new Mesh(
			new PlaneGeometry(0.72, 1.35),
			dumanMat
		)
		duman.position.y = 1.08

		scene.add(kupa, kenar, kulp, kahve, duman)

		kontrolHtml(
			kontroller,
			`<label>Yoğunluk
				<input id="yogunluk" type="range" min="0" max="1.4"
					step="0.02" value="0.85" />
			</label>
			<label>Hız
				<input id="hiz" type="range" min="0" max="0.7"
					step="0.01" value="0.22" />
			</label>`
		)

		sayiBagla(kontroller, "#yogunluk", yogunluk)
		sayiBagla(kontroller, "#hiz", hiz)

		return {
			update: () => {
				controls.update()
				duman.lookAt(
					camera.position.x,
					camera.position.y,
					camera.position.z
				)
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

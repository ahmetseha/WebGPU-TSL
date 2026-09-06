import {
	IcosahedronGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	abs,
	cameraPosition,
	clamp,
	color,
	dot,
	fract,
	mx_noise_float,
	normalWorld,
	normalize,
	positionLocal,
	positionWorld,
	pow,
	smoothstep,
	time,
	uniform,
	uv,
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
	id: "29",
	no: "29",
	title: "Hologram kalkan",
	bolum: "Bölüm 13 — Hologram / kalkan",
	akis: "Fresnel * noise * tarama → opacity + emissive",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.3, 1.5, 3)
		temelIsik(scene)
		const guc = uniform(2.2)
		const gurultu = uniform(3.2)
		const yogunluk = uniform(1)
		const bakis = normalize(
			cameraPosition.sub(positionWorld)
		)
		const nDotV = abs(dot(bakis, normalWorld)).saturate()
		const fresnel = pow(nDotV.oneMinus(), guc)
		const n = mx_noise_float(
			positionLocal
				.mul(gurultu)
				.add(vec3(0, time.mul(0.45), 0)),
			0.5,
			0.5
		)
		const tarama = smoothstep(
			0.18,
			0,
			fract(uv().y.mul(42).sub(time.mul(1.6)))
		)
		const kesitim = fresnel.mul(n.add(0.28))
		const hamAlpha = kesitim
			.mul(0.85)
			.add(tarama.mul(0.12))
			.mul(yogunluk)
		const alpha = clamp(hamAlpha, 0, 1)
		const renk = color("#4de0ff").mul(
			fresnel.add(n.mul(0.25)).add(0.08)
		)

		const kalkan = new MeshStandardNodeMaterial()
		kalkan.colorNode = renk
		kalkan.emissiveNode = color("#7af0ff").mul(
			kesitim.add(tarama.mul(0.4)).mul(1.6)
		)
		kalkan.opacityNode = alpha
		kalkan.transparent = true
		kalkan.depthWrite = false
		kalkan.roughness = 0.2
		kalkan.metalness = 0.05

		const cekirdek = new Mesh(
			new IcosahedronGeometry(0.42, 1),
			new MeshStandardNodeMaterial({
				color: "#2a3344",
				roughness: 0.45,
				metalness: 0.35
			})
		)
		const kabuk = new Mesh(
			new SphereGeometry(1.05, 64, 48),
			kalkan
		)
		scene.add(cekirdek, kabuk)

		kontrolHtml(
			kontroller,
			`<label>Fresnel güç
				<input id="guc" type="range" min="0.6" max="5"
					step="0.1" value="2.2" />
			</label>
			<label>Noise ölçek
				<input id="gurultu" type="range" min="1" max="8"
					step="0.1" value="3.2" />
			</label>
			<label>Yoğunluk
				<input id="yogunluk" type="range" min="0" max="1.8"
					step="0.02" value="1" />
			</label>`
		)

		sayiBagla(kontroller, "#guc", guc)
		sayiBagla(kontroller, "#gurultu", gurultu)
		sayiBagla(kontroller, "#yogunluk", yogunluk)

		return {
			update: (dt) => {
				controls.update()
				cekirdek.rotation.y += dt * 0.35
				cekirdek.rotation.x += dt * 0.12
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

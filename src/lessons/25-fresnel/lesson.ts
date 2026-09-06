import {
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import {
	abs,
	cameraPosition,
	color,
	dot,
	fract,
	mix,
	mx_noise_float,
	normalWorld,
	normalize,
	positionWorld,
	pow,
	smoothstep,
	step,
	time,
	uniform,
	uv,
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
	id: "25",
	no: "25",
	title: "Fresnel",
	bolum: "Bölüm 10 — Fresnel",
	akis: "1 - saturate(N·V) → rim / hologram / kalkan / atmosfer",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.2, 1.4, 2.8)
		temelIsik(scene)
		const mod = uniform(0)
		const guc = uniform(2.4)
		const bakis = normalize(
			cameraPosition.sub(positionWorld)
		)
		const nDotV = abs(dot(bakis, normalWorld)).saturate()
		const fresnel = pow(nDotV.oneMinus(), guc)
		const n = mx_noise_float(
			uv().mul(8).add(time.mul(0.2)),
			0.5,
			0.5
		)
		const tarama = smoothstep(
			0.2,
			0,
			fract(uv().y.mul(36).sub(time.mul(1.4)))
		)
		const icRenk = color("#1a2433")
		const rimRenk = mix(
			icRenk,
			color("#9ee7ff"),
			fresnel
		)
		const holo = color("#5ef0d8").mul(
			fresnel.add(tarama.mul(0.35))
		)
		const kalkan = color("#6ecbff").mul(
			fresnel.mul(n.add(0.35))
		)
		const atmosfer = color("#7eb6ff").mul(
			fresnel.mul(1.4)
		)
		const renk = mix(
			mix(
				mix(rimRenk, holo, step(1, mod)),
				kalkan,
				step(2, mod)
			),
			atmosfer,
			step(3, mod)
		)
		const alpha = mix(
			mix(1, fresnel.add(0.12), step(1, mod)),
			fresnel.mul(n.add(0.25)).add(0.05),
			step(2, mod)
		)

		const material = new MeshStandardNodeMaterial()
		material.colorNode = renk
		material.emissiveNode = mix(
			color("#000000"),
			renk.mul(0.9),
			step(1, mod)
		)
		material.opacityNode = alpha
		material.transparent = true
		material.roughness = 0.3
		material.metalness = 0.1
		material.depthWrite = false

		const ic = new Mesh(
			new SphereGeometry(0.92, 32, 24),
			new MeshStandardNodeMaterial({
				color: "#243044",
				roughness: 0.8
			})
		)
		const kabuk = new Mesh(
			new SphereGeometry(1, 64, 48),
			material
		)
		scene.add(ic, kabuk)

		kontrolHtml(
			kontroller,
			`<button id="rim" type="button" class="aktif">
				Rim ışık
			</button>
			<button id="holo" type="button">Hologram</button>
			<button id="kalkan" type="button">Kalkan</button>
			<button id="atmos" type="button">Atmosfer</button>
			<label>Güç
				<input id="guc" type="range" min="0.6" max="6"
					step="0.1" value="2.4" />
			</label>`
		)

		sayiBagla(kontroller, "#guc", guc)

		const modler = [
			{ id: "rim", deger: 0 },
			{ id: "holo", deger: 1 },
			{ id: "kalkan", deger: 2 },
			{ id: "atmos", deger: 3 }
		]

		for (const { id, deger } of modler) {
			el<HTMLButtonElement>(kontroller, `#${id}`)
				?.addEventListener("click", () => {
					mod.value = deger
					for (const diger of modler) {
						el<HTMLButtonElement>(
							kontroller,
							`#${diger.id}`
						)?.classList.toggle(
							"aktif",
							diger.id === id
						)
					}
				})
		}

		return {
			update: (dt) => {
				controls.update()
				kabuk.rotation.y += dt * 0.15
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

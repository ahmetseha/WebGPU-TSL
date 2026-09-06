import {
	DoubleSide,
	Mesh,
	MeshBasicNodeMaterial,
	PlaneGeometry,
	SphereGeometry
} from "three/webgpu"
import {
	color,
	mix,
	mx_noise_float,
	smoothstep,
	step,
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
import { kameraSifirla } from "@/core/sahne"
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
	id: "19",
	no: "19",
	title: "Noise ile procedural",
	bolum: "Bölüm 7 — Noise",
	akis: "noise → terrain / bulut / duman / dissolve",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 0.4, 3.2)
		const mod = uniform(0)
		const esik = uniform(0.45)
		const n = mx_noise_float(
			uv().mul(6).add(vec2(0, time.mul(-0.12))),
			0.5,
			0.5
		)
		const arazi = mix(
			mix(
				color("#163824"),
				color("#c2b280"),
				smoothstep(0.25, 0.62, n)
			),
			color("#f2f0ea"),
			smoothstep(0.72, 0.9, n)
		)
		const bulut = mix(
			color("#3d5a80"),
			color("#f4f7fb"),
			smoothstep(0.42, 0.7, n)
		)
		const duman = vec3(n.mul(0.55).add(0.28))
		const erime = step(esik, n)
		const erimeRenk = mix(
			color("#111318"),
			color("#3ec5f1"),
			erime
		)
		const renk = mix(
			mix(
				mix(arazi, bulut, step(1, mod)),
				duman,
				step(2, mod)
			),
			erimeRenk,
			step(3, mod)
		)

		const material = new MeshBasicNodeMaterial()
		material.colorNode = renk
		material.opacityNode = mix(1, erime, step(3, mod))
		material.transparent = true
		material.side = DoubleSide

		const duzlem = new Mesh(
			new PlaneGeometry(2.2, 2.2),
			material
		)
		const kure = new Mesh(
			new SphereGeometry(1, 48, 32),
			material
		)
		kure.visible = false
		scene.add(duzlem, kure)

		kontrolHtml(
			kontroller,
			`<button id="arazi" type="button" class="aktif">
				Arazi
			</button>
			<button id="bulut" type="button">Bulut</button>
			<button id="duman" type="button">Duman</button>
			<button id="erime" type="button">Dissolve</button>
			<button id="sekil" type="button">Küre / plane</button>
			<label>Eşik
				<input id="esik" type="range" min="0" max="1"
					step="0.01" value="0.45" />
			</label>`
		)

		sayiBagla(kontroller, "#esik", esik)

		const modler = [
			{ id: "arazi", deger: 0 },
			{ id: "bulut", deger: 1 },
			{ id: "duman", deger: 2 },
			{ id: "erime", deger: 3 }
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

		el<HTMLButtonElement>(kontroller, "#sekil")
			?.addEventListener("click", (event) => {
				kure.visible = !kure.visible
				duzlem.visible = !kure.visible
				if (event.currentTarget instanceof HTMLElement) {
					event.currentTarget.classList.toggle(
						"aktif",
						kure.visible
					)
				}
			})

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

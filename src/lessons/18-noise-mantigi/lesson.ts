import {
	hash,
	mix,
	mx_noise_float,
	step,
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
import { shaderDuzlem } from "@/core/shader-ders"
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
	id: "18",
	no: "18",
	title: "Noise mantığı",
	bolum: "Bölüm 7 — Noise",
	akis: "hash(uv) rastgele → mx_noise ölçek 4 / 20",
	notes,
	start({ app, kontroller }) {
		const mod = uniform(0)
		const olcek = uniform(4)
		const tohum = uv().x.mul(900).add(uv().y.mul(470))
		const rastgele = hash(tohum)
		const gurultu = mx_noise_float(
			uv().mul(olcek),
			0.5,
			0.5
		)
		const renk = mix(
			vec3(rastgele),
			vec3(gurultu),
			step(1, mod)
		)
		const handle = shaderDuzlem(app, renk)

		kontrolHtml(
			kontroller,
			`<button id="rastgele" type="button" class="aktif">
				hash rastgele
			</button>
			<button id="value4" type="button">
				noise ölçek 4
			</button>
			<button id="perlin20" type="button">
				noise ölçek 20
			</button>
			<label>Ölçek
				<input id="olcek" type="range" min="1" max="32"
					step="0.5" value="4" />
			</label>`
		)

		sayiBagla(kontroller, "#olcek", olcek)

		const dugmeler = [
			{ id: "rastgele", deger: 0, olcek: 4 },
			{ id: "value4", deger: 1, olcek: 4 },
			{ id: "perlin20", deger: 1, olcek: 20 }
		]

		for (const secim of dugmeler) {
			el<HTMLButtonElement>(kontroller, `#${secim.id}`)
				?.addEventListener("click", () => {
					mod.value = secim.deger
					olcek.value = secim.olcek
					const kaydir = el<HTMLInputElement>(
						kontroller,
						"#olcek"
					)
					if (kaydir !== null) {
						kaydir.value = String(secim.olcek)
					}
					for (const diger of dugmeler) {
						el<HTMLButtonElement>(
							kontroller,
							`#${diger.id}`
						)?.classList.toggle(
							"aktif",
							diger.id === secim.id
						)
					}
				})
		}

		return handle
	}
}

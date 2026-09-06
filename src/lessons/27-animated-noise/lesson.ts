import {
	color,
	mix,
	mx_noise_float,
	mx_noise_vec3,
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
	id: "27",
	no: "27",
	title: "Animated noise",
	bolum: "Bölüm 11 — Procedural animation",
	akis: "noise(uv + time) → duman / su / enerji / lav",
	notes,
	start({ app, kontroller }) {
		const mod = uniform(0)
		const hiz = uniform(0.35)
		const olcek = uniform(4)
		const kayan = uv().add(vec2(0, time.mul(hiz).negate()))
		const n = mx_noise_float(kayan.mul(olcek), 0.5, 0.5)
		const n2 = mx_noise_float(
			kayan.mul(olcek.mul(2.2)).add(1.7),
			0.5,
			0.5
		)
		const n3 = mx_noise_vec3(
			vec3(uv().x, uv().y, time.mul(hiz))
				.mul(olcek)
		)
		const duman = vec3(n.mul(0.55).add(0.2))
		const su = mix(
			color("#0b3d5c"),
			color("#7fe3ff"),
			smoothstep(0.35, 0.7, n.add(n2.mul(0.35)))
		)
		const enerji = color("#5ef0d8").mul(
			n3.x.abs().add(0.15)
		)
		const lav = mix(
			color("#1a0a05"),
			mix(
				color("#c43c12"),
				color("#ffe27a"),
				smoothstep(0.55, 0.85, n2)
			),
			smoothstep(0.28, 0.65, n)
		)
		const renk = mix(
			mix(
				mix(duman, su, step(1, mod)),
				enerji,
				step(2, mod)
			),
			lav,
			step(3, mod)
		)
		const handle = shaderDuzlem(app, renk)

		kontrolHtml(
			kontroller,
			`<button id="duman" type="button" class="aktif">
				Duman
			</button>
			<button id="su" type="button">Su</button>
			<button id="enerji" type="button">Enerji</button>
			<button id="lav" type="button">Lav</button>
			<label>Hız
				<input id="hiz" type="range" min="0" max="1.2"
					step="0.02" value="0.35" />
			</label>
			<label>Ölçek
				<input id="olcek" type="range" min="1" max="12"
					step="0.25" value="4" />
			</label>`
		)

		sayiBagla(kontroller, "#hiz", hiz)
		sayiBagla(kontroller, "#olcek", olcek)

		const modler = [
			{ id: "duman", deger: 0 },
			{ id: "su", deger: 1 },
			{ id: "enerji", deger: 2 },
			{ id: "lav", deger: 3 }
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

		return handle
	}
}

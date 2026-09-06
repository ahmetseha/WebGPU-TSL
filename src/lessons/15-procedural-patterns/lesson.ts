import {
	abs,
	color,
	distance,
	float,
	floor,
	fract,
	mix,
	sin,
	step,
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

function sec(
	uMod: TSLNode,
	indeks: number,
	desen: TSLNode
): TSLNode {
	const w = float(1)
		.sub(uMod.sub(indeks).abs())
		.saturate()
	return desen.mul(w)
}

function gri(n: TSLNode): TSLNode {
	return vec3(n, n, n)
}

export const lesson: LessonModule = {
	id: "15",
	no: "15",
	title: "Yordamsal desenler",
	bolum: "Bölüm 4 — UV ve desenler",
	akis: "math(uv) → pattern → color",
	notes,
	start({ app, kontroller }) {
		const uMod = uniform(0)
		const u = uv()
		const a = color("#141821")
		const b = color("#3ec5f1")
		const gradyan = mix(a, b, u.x)
		const serit = mix(
			a,
			b,
			step(0.5, fract(u.x.mul(10)))
		)
		const kare = floor(u.mul(8))
		const damla = mix(
			a,
			b,
			kare.x.add(kare.y).mod(2)
		)
		const daire = mix(
			a,
			b,
			float(1)
				.sub(distance(u, vec2(0.5)).mul(2))
				.saturate()
		)
		const halka = mix(
			a,
			b,
			float(1)
				.sub(
					abs(
						distance(u, vec2(0.5)).sub(0.35)
					).mul(18)
				)
				.saturate()
		)
		const hucre = fract(u.mul(8))
		const izgara = mix(
			a,
			b,
			float(1).sub(
				step(0.08, hucre.x).mul(step(0.08, hucre.y))
			)
		)
		const dalga = gri(
			sin(u.x.mul(30).add(u.y.mul(8)))
				.mul(0.5)
				.add(0.5)
		)
		const radial = mix(
			b,
			a,
			distance(u, vec2(0.5)).mul(2).saturate()
		)
		const renk = sec(uMod, 0, gradyan)
			.add(sec(uMod, 1, serit))
			.add(sec(uMod, 2, damla))
			.add(sec(uMod, 3, daire))
			.add(sec(uMod, 4, halka))
			.add(sec(uMod, 5, izgara))
			.add(sec(uMod, 6, dalga))
			.add(sec(uMod, 7, radial))

		kontrolHtml(
			kontroller,
			`<button id="gradyan" type="button" class="aktif">
				Gradyan
			</button>
			<button id="serit" type="button">Şerit</button>
			<button id="damla" type="button">Dama</button>
			<button id="daire" type="button">Daire</button>
			<button id="halka" type="button">Halka</button>
			<button id="grid" type="button">Izgara</button>
			<button id="dalga" type="button">Dalga</button>
			<button id="radial" type="button">
				Radyal
			</button>`
		)

		const idler = [
			"gradyan",
			"serit",
			"damla",
			"daire",
			"halka",
			"grid",
			"dalga",
			"radial"
		]

		const kur = (v: number, id: string): void => {
			uMod.value = v
			for (const ad of idler) {
				el(kontroller, `#${ad}`)?.classList.toggle(
					"aktif",
					ad === id
				)
			}
		}

		idler.forEach((id, i) => {
			el<HTMLButtonElement>(kontroller, `#${id}`)
				?.addEventListener("click", () => {
					kur(i, id)
				})
		})

		return shaderDuzlem(app, renk)
	}
}

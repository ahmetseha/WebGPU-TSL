import {
	color,
	distance,
	float,
	Fn,
	mix,
	mx_noise_float,
	sin,
	time,
	uniform,
	uv,
	vec2
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { shaderDuzlem } from "@/core/shader-ders"
import notes from "./notlar.md?raw"

const createCircle = Fn(() => {
	const u = uv()
	return float(1)
		.sub(distance(u, vec2(0.5)).mul(2.2))
		.saturate()
})

const createWave = Fn(() => {
	return sin(uv().y.mul(18).add(time.mul(2)))
		.mul(0.5)
		.add(0.5)
})

const createNoiseMask = Fn(() => {
	return mx_noise_float(
		uv().mul(5).add(time.mul(0.15))
	)
		.mul(0.5)
		.add(0.5)
})

export const lesson: LessonModule = {
	id: "12",
	no: "12",
	title: "Fn",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "Fn → çağrı → node graph yeniden kullanım",
	notes,
	start({ app, kontroller }) {
		const uDaire = uniform(1)
		const uDalga = uniform(0.22)
		const uGurultu = uniform(1)
		const daire = createCircle().mul(uDaire)
		const dalga = createWave().mul(uDalga)
		const gurultu = mix(
			float(1),
			createNoiseMask(),
			uGurultu
		)
		const maske = daire.mul(gurultu)
		const renk = mix(
			color("#12151c"),
			color("#3ec5f1"),
			maske
		).add(color("#ffcc33").mul(dalga))

		kontrolHtml(
			kontroller,
			`<label>Daire
				<input id="daire" type="range"
					min="0" max="1" step="0.01" value="1" />
			</label>
			<label>Dalga
				<input id="dalga" type="range"
					min="0" max="1" step="0.01" value="0.22" />
			</label>
			<label>Gürültü
				<input id="gurultu" type="range"
					min="0" max="1" step="0.01" value="1" />
			</label>`
		)

		const bagla = (
			id: string,
			yaz: (n: number) => void
		): void => {
			el<HTMLInputElement>(kontroller, id)
				?.addEventListener("input", (event) => {
					const hedef = event.target
					if (
						!(hedef instanceof HTMLInputElement)
					) {
						return
					}
					yaz(Number(hedef.value))
				})
		}

		bagla("#daire", (n) => {
			uDaire.value = n
		})
		bagla("#dalga", (n) => {
			uDalga.value = n
		})
		bagla("#gurultu", (n) => {
			uGurultu.value = n
		})

		return shaderDuzlem(app, renk)
	}
}

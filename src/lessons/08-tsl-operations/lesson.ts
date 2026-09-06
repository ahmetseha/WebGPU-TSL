import {
	clamp,
	color,
	float,
	mix,
	sin,
	smoothstep,
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

export const lesson: LessonModule = {
	id: "08",
	no: "08",
	title: "TSL işlemleri",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "uv.x → op(mix / smoothstep / sin / step / clamp)",
	notes,
	start({ app, kontroller }) {
		const uMod = uniform(1)
		const x = uv().x
		const a = color("#1a2230")
		const b = color("#3ec5f1")
		const karisim = mix(a, b, x)
		const bant = smoothstep(0.35, 0.45, x).sub(
			smoothstep(0.55, 0.65, x)
		)
		const yumusak = mix(a, b, bant)
		const dalga = vec3(
			sin(x.mul(24)).mul(0.5).add(0.5)
		)
		const adim = mix(a, b, step(0.5, x))
		const kirp = mix(
			a,
			b,
			clamp(x.mul(2).sub(0.5), 0, 1)
		)
		const renk = sec(uMod, 0, karisim)
			.add(sec(uMod, 1, yumusak))
			.add(sec(uMod, 2, dalga))
			.add(sec(uMod, 3, adim))
			.add(sec(uMod, 4, kirp))

		kontrolHtml(
			kontroller,
			`<button id="mix" type="button">mix</button>
			<button id="smooth" type="button" class="aktif">
				smoothstep
			</button>
			<button id="sin" type="button">sin</button>
			<button id="step" type="button">step</button>
			<button id="clamp" type="button">clamp</button>`
		)

		const idler = [
			"mix",
			"smooth",
			"sin",
			"step",
			"clamp"
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

		el<HTMLButtonElement>(kontroller, "#mix")
			?.addEventListener("click", () => {
				kur(0, "mix")
			})
		el<HTMLButtonElement>(kontroller, "#smooth")
			?.addEventListener("click", () => {
				kur(1, "smooth")
			})
		el<HTMLButtonElement>(kontroller, "#sin")
			?.addEventListener("click", () => {
				kur(2, "sin")
			})
		el<HTMLButtonElement>(kontroller, "#step")
			?.addEventListener("click", () => {
				kur(3, "step")
			})
		el<HTMLButtonElement>(kontroller, "#clamp")
			?.addEventListener("click", () => {
				kur(4, "clamp")
			})

		return shaderDuzlem(app, renk)
	}
}

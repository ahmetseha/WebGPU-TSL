import { color, mix, uniform, uv } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { shaderDuzlem } from "@/core/shader-ders"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "06",
	no: "06",
	title: "TSL nedir?",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "JS node graph → TSL → WGSL/GLSL → GPU",
	notes,
	start({ app, kontroller }) {
		const uKay = uniform(0)
		const t = uv().x.add(uKay)
		const renk = mix(
			color("#1a2230"),
			color("#3ec5f1"),
			t
		)

		kontrolHtml(
			kontroller,
			`<label>Kaydır
				<input id="kay" type="range"
					min="-0.5" max="0.5" step="0.01"
					value="0" />
			</label>`
		)

		el<HTMLInputElement>(kontroller, "#kay")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uKay.value = Number(hedef.value)
			})

		return shaderDuzlem(app, renk)
	}
}

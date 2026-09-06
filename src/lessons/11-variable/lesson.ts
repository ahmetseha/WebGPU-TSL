import {
	color,
	fract,
	mix,
	uniform,
	uv
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { shaderDuzlem } from "@/core/shader-ders"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "11",
	no: "11",
	title: "Variable (toVar)",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "immutable node → toVar() → adlandırılmış adım",
	notes,
	start({ app, kontroller }) {
		const uOlcek = uniform(8)
		const olcekli = uv().mul(uOlcek).toVar("olcekli")
		const hucre = fract(olcekli).toVar("hucre")
		const karisim = hucre.x
			.mul(hucre.y)
			.toVar("karisim")
		const renk = mix(
			color("#141821"),
			color("#3ec5f1"),
			karisim
		)

		kontrolHtml(
			kontroller,
			`<label>Ölçek
				<input id="olcek" type="range"
					min="2" max="16" step="0.5" value="8" />
			</label>`
		)

		el<HTMLInputElement>(kontroller, "#olcek")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				uOlcek.value = Number(hedef.value)
			})

		return shaderDuzlem(app, renk)
	}
}

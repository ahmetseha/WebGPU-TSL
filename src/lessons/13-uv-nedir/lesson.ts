import { mix, uniform, uv, vec3 } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { shaderDuzlem } from "@/core/shader-ders"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "13",
	no: "13",
	title: "UV nedir?",
	bolum: "Bölüm 4 — UV ve desenler",
	akis: "Mesh UV 0–1 → interpolasyon → fragment",
	notes,
	start({ app, kontroller }) {
		const uMod = uniform(0)
		const u = uv()
		const debug = vec3(u.x, u.y, 0)
		const sadeceU = vec3(u.x, u.x, u.x)
		const renk = mix(debug, sadeceU, uMod)

		kontrolHtml(
			kontroller,
			`<button id="uv" type="button" class="aktif">
				UV (R=U G=V)
			</button>
			<button id="u" type="button">Yalnız U</button>`
		)

		el<HTMLButtonElement>(kontroller, "#uv")
			?.addEventListener("click", (event) => {
				uMod.value = 0
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.add("aktif")
				el(kontroller, "#u")?.classList.remove(
					"aktif"
				)
			})

		el<HTMLButtonElement>(kontroller, "#u")
			?.addEventListener("click", (event) => {
				uMod.value = 1
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.add("aktif")
				el(kontroller, "#uv")?.classList.remove(
					"aktif"
				)
			})

		return shaderDuzlem(app, renk)
	}
}

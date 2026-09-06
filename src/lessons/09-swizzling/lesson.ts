import {
	float,
	positionLocal,
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
	id: "09",
	no: "09",
	title: "Swizzling",
	bolum: "Bölüm 3 — TSL temelleri",
	akis: "vec4 → .x .y .rgb .yx .xyz → yeni vec",
	notes,
	start({ app, kontroller }) {
		const uMod = uniform(0)
		const u = uv()
		const x = u.x
		const y = u.y
		const uvX = vec3(x, x, x)
		const uvY = vec3(y, y, y)
		const uvYx = vec3(u.y, u.x, 0)
		const py = positionLocal.y.mul(0.5).add(0.5)
		const posY = vec3(py, py, py)
		const renk = sec(uMod, 0, uvX)
			.add(sec(uMod, 1, uvY))
			.add(sec(uMod, 2, uvYx))
			.add(sec(uMod, 3, posY))

		kontrolHtml(
			kontroller,
			`<button id="uvx" type="button" class="aktif">
				uv.x
			</button>
			<button id="uvy" type="button">uv.y</button>
			<button id="uvyx" type="button">uv.yx</button>
			<button id="posy" type="button">
				positionLocal.y
			</button>`
		)

		const idler = ["uvx", "uvy", "uvyx", "posy"]

		const kur = (v: number, id: string): void => {
			uMod.value = v
			for (const ad of idler) {
				el(kontroller, `#${ad}`)?.classList.toggle(
					"aktif",
					ad === id
				)
			}
		}

		el<HTMLButtonElement>(kontroller, "#uvx")
			?.addEventListener("click", () => {
				kur(0, "uvx")
			})
		el<HTMLButtonElement>(kontroller, "#uvy")
			?.addEventListener("click", () => {
				kur(1, "uvy")
			})
		el<HTMLButtonElement>(kontroller, "#uvyx")
			?.addEventListener("click", () => {
				kur(2, "uvyx")
			})
		el<HTMLButtonElement>(kontroller, "#posy")
			?.addEventListener("click", () => {
				kur(3, "posy")
			})

		return shaderDuzlem(app, renk)
	}
}

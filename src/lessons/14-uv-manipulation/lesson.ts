import {
	color,
	cos,
	floor,
	mix,
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

export const lesson: LessonModule = {
	id: "14",
	no: "14",
	title: "UV manipülasyonu",
	bolum: "Bölüm 4 — UV ve desenler",
	akis: "uv * ölçek + offset + rot + time kaydırma",
	notes,
	start({ app, kontroller }) {
		const uOlcek = uniform(3)
		const uOfsetX = uniform(0)
		const uOfsetY = uniform(0)
		const uDonus = uniform(0)
		const uKaydir = uniform(0.2)
		const orta = vec2(0.5, 0.5)
		const kayan = uv()
			.add(vec2(time.mul(uKaydir), 0))
			.add(vec2(uOfsetX, uOfsetY))
		const q = kayan.sub(orta).mul(uOlcek)
		const c = cos(uDonus)
		const s = sin(uDonus)
		const donen = vec2(
			q.x.mul(c).sub(q.y.mul(s)),
			q.x.mul(s).add(q.y.mul(c))
		).add(orta)
		const kare = floor(donen.mul(8))
		const damla = kare.x.add(kare.y).mod(2)
		const renk = mix(
			color("#141821"),
			color("#3ec5f1"),
			damla
		)

		kontrolHtml(
			kontroller,
			`<label>Ölçek
				<input id="olcek" type="range"
					min="0.2" max="8" step="0.1" value="3" />
			</label>
			<label>Offset X
				<input id="ox" type="range"
					min="-1" max="1" step="0.01" value="0" />
			</label>
			<label>Offset Y
				<input id="oy" type="range"
					min="-1" max="1" step="0.01" value="0" />
			</label>
			<label>Dönüş
				<input id="donus" type="range"
					min="0" max="6.28" step="0.01"
					value="0" />
			</label>
			<label>Kaydırma
				<input id="kaydir" type="range"
					min="0" max="2" step="0.01"
					value="0.2" />
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

		bagla("#olcek", (n) => {
			uOlcek.value = n
		})
		bagla("#ox", (n) => {
			uOfsetX.value = n
		})
		bagla("#oy", (n) => {
			uOfsetY.value = n
		})
		bagla("#donus", (n) => {
			uDonus.value = n
		})
		bagla("#kaydir", (n) => {
			uKaydir.value = n
		})

		return shaderDuzlem(app, renk)
	}
}

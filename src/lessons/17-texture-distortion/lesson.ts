import {
	CanvasTexture,
	RepeatWrapping
} from "three/webgpu"
import {
	mx_noise_float,
	sin,
	texture,
	time,
	uniform,
	uv,
	vec2,
	type TSLNode
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { shaderDuzlem } from "@/core/shader-ders"
import notes from "./notlar.md?raw"

function damaliDokum(): CanvasTexture {
	const boyut = 256
	const tuval = document.createElement("canvas")
	tuval.width = boyut
	tuval.height = boyut
	const ctx = tuval.getContext("2d")

	if (ctx === null) {
		throw new Error("2D bağlam yok")
	}

	const kare = 32

	for (let y = 0; y < boyut; y += kare) {
		for (let x = 0; x < boyut; x += kare) {
			const acik = (x / kare + y / kare) % 2 === 0
			ctx.fillStyle = acik ? "#f4d35e" : "#2bb0d6"
			ctx.fillRect(x, y, kare, kare)
		}
	}

	ctx.fillStyle = "#e23d4d"
	ctx.beginPath()
	ctx.arc(128, 128, 40, 0, Math.PI * 2)
	ctx.fill()

	const doku = new CanvasTexture(tuval)
	doku.wrapS = RepeatWrapping
	doku.wrapT = RepeatWrapping
	doku.needsUpdate = true
	return doku
}

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
	id: "17",
	no: "17",
	title: "Texture distortion",
	bolum: "Bölüm 6 — Texture",
	akis: "uv + sin(y*freq+time)*amp + noise → texture()",
	notes,
	start({ app, kontroller }) {
		const doku = damaliDokum()
		const freq = uniform(10)
		const amp = uniform(0.04)
		const gurultu = uniform(0.12)
		const dalga = sin(
			uv().y.mul(freq).add(time.mul(2))
		).mul(amp)
		const n = mx_noise_float(
			uv().mul(5).add(time.mul(0.25))
		)
		const uvBozuk = uv().add(
			vec2(dalga.add(n.mul(gurultu)), 0)
		)
		const ornek = texture(doku, uvBozuk)
		const handle = shaderDuzlem(app, ornek.rgb)

		kontrolHtml(
			kontroller,
			`<label>Frekans
				<input id="freq" type="range" min="2" max="24"
					step="0.5" value="10" />
			</label>
			<label>Genlik
				<input id="amp" type="range" min="0" max="0.12"
					step="0.005" value="0.04" />
			</label>
			<label>Gürültü
				<input id="gurultu" type="range" min="0" max="0.35"
					step="0.01" value="0.12" />
			</label>`
		)

		sayiBagla(kontroller, "#freq", freq)
		sayiBagla(kontroller, "#amp", amp)
		sayiBagla(kontroller, "#gurultu", gurultu)

		return {
			update: handle.update,
			dispose: () => {
				handle.dispose()
				doku.dispose()
			}
		}
	}
}

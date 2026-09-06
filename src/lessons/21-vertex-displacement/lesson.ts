import {
	DoubleSide,
	Mesh,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	SphereGeometry
} from "three/webgpu"
import {
	Fn,
	length,
	mix,
	mx_noise_float,
	normalLocal,
	positionLocal,
	sin,
	step,
	time,
	uniform,
	vec3,
	type TSLNode
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
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
	id: "21",
	no: "21",
	title: "Vertex displacement",
	bolum: "Bölüm 8 — Vertex manipulation",
	akis: "positionLocal + sin / noise + time → dalga / bayrak / arazi / jel",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.4, 1.6, 3.4)
		temelIsik(scene)
		const mod = uniform(0)
		const amp = uniform(0.16)
		const freq = uniform(4)

		const dalga = Fn(() => {
			return sin(
				positionLocal.x.mul(freq).add(time.mul(2))
			).mul(amp)
		})

		const bayrak = dalga().mul(
			positionLocal.x.add(1).mul(0.5)
		)
		const arazi = mx_noise_float(
			vec3(
				positionLocal.x,
				positionLocal.y,
				time.mul(0.15)
			).mul(freq),
			amp,
			0
		)
		const zOff = mix(
			mix(dalga(), bayrak, step(1, mod)),
			arazi,
			step(2, mod)
		)
		const jel = sin(
			time.mul(3).add(length(positionLocal).mul(8))
		).mul(amp)

		const planeMat = new MeshStandardNodeMaterial({
			color: "#7ec4ff"
		})
		planeMat.positionNode = positionLocal.add(
			vec3(0, 0, zOff)
		)
		planeMat.roughness = 0.42
		planeMat.side = DoubleSide

		const kureMat = new MeshStandardNodeMaterial({
			color: "#f0a0c0"
		})
		kureMat.positionNode = positionLocal.add(
			normalLocal.mul(jel)
		)
		kureMat.roughness = 0.35

		const duzlem = new Mesh(
			new PlaneGeometry(2.4, 2.4, 80, 80),
			planeMat
		)
		const kure = new Mesh(
			new SphereGeometry(0.95, 64, 48),
			kureMat
		)
		kure.visible = false
		scene.add(duzlem, kure)

		kontrolHtml(
			kontroller,
			`<button id="dalga" type="button" class="aktif">
				Dalga
			</button>
			<button id="bayrak" type="button">Bayrak</button>
			<button id="arazi" type="button">Arazi</button>
			<button id="jel" type="button">Jel</button>
			<label>Genlik
				<input id="amp" type="range" min="0" max="0.4"
					step="0.01" value="0.16" />
			</label>
			<label>Frekans
				<input id="freq" type="range" min="1" max="10"
					step="0.25" value="4" />
			</label>`
		)

		sayiBagla(kontroller, "#amp", amp)
		sayiBagla(kontroller, "#freq", freq)

		const uygula = (deger: number): void => {
			mod.value = deger
			kure.visible = deger === 3
			duzlem.visible = deger !== 3
			const idler = ["dalga", "bayrak", "arazi", "jel"]
			for (let i = 0; i < idler.length; i += 1) {
				const id = idler[i]
				if (id === undefined) continue
				el<HTMLButtonElement>(kontroller, `#${id}`)
					?.classList.toggle("aktif", i === deger)
			}
		}

		el<HTMLButtonElement>(kontroller, "#dalga")
			?.addEventListener("click", () => uygula(0))
		el<HTMLButtonElement>(kontroller, "#bayrak")
			?.addEventListener("click", () => uygula(1))
		el<HTMLButtonElement>(kontroller, "#arazi")
			?.addEventListener("click", () => uygula(2))
		el<HTMLButtonElement>(kontroller, "#jel")
			?.addEventListener("click", () => uygula(3))

		return {
			update: () => {
				controls.update()
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

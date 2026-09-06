import {
	CanvasTexture,
	DoubleSide,
	Mesh,
	MeshBasicNodeMaterial,
	PlaneGeometry,
	RepeatWrapping
} from "three/webgpu"
import {
	fract,
	mix,
	step,
	texture,
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
import { kameraSifirla } from "@/core/sahne"
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
			ctx.globalAlpha = x < boyut * 0.55 ? 1 : 0.28
			ctx.fillStyle = acik ? "#f4d35e" : "#2bb0d6"
			ctx.fillRect(x, y, kare, kare)
		}
	}

	ctx.globalAlpha = 1
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
	id: "16",
	no: "16",
	title: "Texture sampling",
	bolum: "Bölüm 6 — Texture",
	akis: "CanvasTexture → texture(map, uv) → color / alpha / mask",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 0, 2.8)
		const doku = damaliDokum()
		const tekrar = uniform(1)
		const mod = uniform(0)
		const ornek = texture(doku, uv().mul(tekrar))
		const gri = vec3(ornek.a)
		const zemin = mix(
			vec3(0.09, 0.11, 0.15),
			vec3(0.18, 0.2, 0.26),
			step(0.5, fract(uv().x.mul(12)))
		)

		const arkaMat = new MeshBasicNodeMaterial()
		arkaMat.colorNode = zemin
		const arka = new Mesh(
			new PlaneGeometry(2.2, 2.2),
			arkaMat
		)
		arka.position.z = -0.04

		const material = new MeshBasicNodeMaterial()
		material.colorNode = mix(
			mix(ornek.rgb, gri, step(1, mod)),
			ornek.rgb,
			step(2, mod)
		)
		material.opacityNode = mix(1, ornek.a, step(2, mod))
		material.transparent = true
		material.side = DoubleSide

		const mesh = new Mesh(
			new PlaneGeometry(2, 2),
			material
		)
		scene.add(arka, mesh)

		kontrolHtml(
			kontroller,
			`<label>Tekrar
				<input id="tekrar" type="range" min="1" max="6"
					step="1" value="1" />
			</label>
			<button id="renk" type="button" class="aktif">
				Renk
			</button>
			<button id="alpha" type="button">Alpha</button>
			<button id="maske" type="button">Maske</button>`
		)

		sayiBagla(kontroller, "#tekrar", tekrar)

		const modler = [
			{ id: "renk", deger: 0 },
			{ id: "alpha", deger: 1 },
			{ id: "maske", deger: 2 }
		]

		for (const { id, deger } of modler) {
			el<HTMLButtonElement>(kontroller, `#${id}`)
				?.addEventListener("click", () => {
					mod.value = deger
					for (const diger of modler) {
						el<HTMLButtonElement>(
							kontroller,
							`#${diger.id}`
						)?.classList.toggle(
							"aktif",
							diger.id === id
						)
					}
				})
		}

		return {
			update: () => {
				controls.update()
			},
			dispose: () => {
				controls.dispose()
				doku.dispose()
			}
		}
	}
}

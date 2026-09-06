import {
	IcosahedronGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	RenderPipeline,
	SphereGeometry
} from "three/webgpu"
import {
	length,
	mx_noise_float,
	pass,
	sin,
	smoothstep,
	texture,
	time,
	uv,
	vec2,
	vec3,
	vec4,
	type TSLNode
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

type EfektAdi =
	| "ham"
	| "gri"
	| "tint"
	| "rgb"
	| "vignette"
	| "noise"
	| "scanline"

function efekt(
	doku: TSLNode,
	ad: EfektAdi
): TSLNode {
	const uv0 = uv()
	const renk = doku

	if (ad === "ham") {
		return renk
	}

	if (ad === "gri") {
		const g = renk.r
			.mul(0.299)
			.add(renk.g.mul(0.587))
			.add(renk.b.mul(0.114))
		return vec4(g, g, g, 1)
	}

	if (ad === "tint") {
		return vec4(renk.rgb.mul(vec3(1, 0.72, 0.45)), 1)
	}

	if (ad === "rgb") {
		const k = 0.01
		const r = texture(doku.value, uv0.add(vec2(k, 0))).r
		const g = texture(doku.value, uv0).g
		const b = texture(
			doku.value,
			uv0.sub(vec2(k, 0))
		).b
		return vec4(r, g, b, 1)
	}

	if (ad === "vignette") {
		const d = length(uv0.sub(0.5))
		const v = smoothstep(0.28, 0.95, d)
		return vec4(
			renk.rgb.mul(v.oneMinus().mul(0.85).add(0.15)),
			1
		)
	}

	if (ad === "noise") {
		const n = mx_noise_float(
			uv0.mul(380).add(time)
		).mul(0.12)
		return vec4(renk.rgb.add(n), 1)
	}

	const cizgi = sin(uv0.y.mul(880))
		.mul(0.5)
		.add(0.5)
	return vec4(
		renk.rgb.mul(cizgi.mul(0.3).add(0.7)),
		1
	)
}

export const lesson: LessonModule = {
	id: "37",
	no: "37",
	title: "TSL Post-processing",
	bolum: "Bölüm 16 — Post Processing",
	akis: "getTextureNode → TSL efekt → pipeline",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, camera, renderer } = app
		const controls = kameraSifirla(app, 2.3, 1.5, 3.5)
		temelIsik(scene)

		const a = new Mesh(
			new SphereGeometry(0.65, 32, 32),
			new MeshStandardNodeMaterial({
				color: "#3ec5f1"
			})
		)
		const b = new Mesh(
			new IcosahedronGeometry(0.4, 0),
			new MeshStandardNodeMaterial({
				color: "#ff6b6b"
			})
		)
		b.position.set(1.35, 0.15, 0)
		scene.add(a, b)

		const scenePass = pass(scene, camera)
		const doku = scenePass.getTextureNode()
		const pipeline = new RenderPipeline(renderer)
		let aktif: EfektAdi = "ham"
		pipeline.outputNode = efekt(doku, aktif)

		kontrolHtml(
			kontroller,
			`<button id="ham" type="button" class="aktif">Ham</button>
			<button id="gri" type="button">Grayscale</button>
			<button id="tint" type="button">Tint</button>
			<button id="rgb" type="button">RGB shift</button>
			<button id="vignette" type="button">Vignette</button>
			<button id="noise" type="button">Noise</button>
			<button id="scanline" type="button">Scanline</button>`
		)

		const adlar: EfektAdi[] = [
			"ham",
			"gri",
			"tint",
			"rgb",
			"vignette",
			"noise",
			"scanline"
		]

		const sec = (ad: EfektAdi): void => {
			aktif = ad
			pipeline.outputNode = efekt(doku, ad)
			pipeline.needsUpdate = true
			for (const id of adlar) {
				el<HTMLButtonElement>(
					kontroller,
					`#${id}`
				)?.classList.toggle("aktif", id === ad)
			}
		}

		for (const id of adlar) {
			el<HTMLButtonElement>(kontroller, `#${id}`)
				?.addEventListener("click", () => {
					sec(id)
				})
		}

		return {
			render: () => {
				pipeline.render()
			},
			update: () => {
				controls.update()
				a.rotation.y += 0.005
				b.rotation.y -= 0.008
				istatistikEk.textContent = `efekt: ${aktif}`
			},
			dispose: () => {
				controls.dispose()
				pipeline.dispose()
				a.material.dispose()
				b.material.dispose()
				a.geometry.dispose()
				b.geometry.dispose()
			}
		}
	}
}

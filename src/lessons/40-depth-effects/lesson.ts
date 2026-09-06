import {
	BoxGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	RenderPipeline,
	SphereGeometry
} from "three/webgpu"
import {
	mix,
	pass,
	texture,
	uniform,
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
import { ky, kyVar } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

type DerinlikGecisi = TSLNode & {
	getLinearDepthNode: () => TSLNode
}

type Efekt = "sis" | "renk" | "odak"

function derinlikAl(
	scenePass: DerinlikGecisi
): TSLNode {
	return typeof scenePass.getDepthNode === "function"
		? scenePass.getDepthNode()
		: scenePass.getLinearDepthNode()
}

function sis(renk: TSLNode, d: TSLNode): TSLNode {
	const t = d.saturate()
	return mix(renk, vec4(vec3(0.62, 0.7, 0.82), 1), t)
}

function derinlikRenk(
	renk: TSLNode,
	d: TSLNode
): TSLNode {
	const palet = mix(
		vec3(0.2, 0.85, 1),
		vec3(1, 0.25, 0.45),
		d.saturate()
	)
	return vec4(renk.rgb.mul(0.25).add(palet.mul(0.75)), 1)
}

function odak(
	doku: TSLNode,
	d: TSLNode,
	odakNokta: TSLNode
): TSLNode {
	const uv0 = uv()
	const k = 0.012
	const bulanik = texture(doku.value, uv0)
		.add(texture(doku.value, uv0.add(vec2(k, 0))))
		.add(texture(doku.value, uv0.sub(vec2(k, 0))))
		.add(texture(doku.value, uv0.add(vec2(0, k))))
		.add(texture(doku.value, uv0.sub(vec2(0, k))))
		.div(5)
	const fark = d.sub(odakNokta).abs().mul(4).saturate()
	return mix(doku, bulanik, fark)
}

export const lesson: LessonModule = {
	id: "40",
	no: "40",
	title: "Depth Effects",
	bolum: "Bölüm 17 — Depth",
	akis: "depth → sis / renk / kaba odak",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, camera, renderer } = app
		const controls = kameraSifirla(app, 2.4, 1.4, 5)
		temelIsik(scene)
		camera.near = 0.4
		camera.far = 22
		camera.updateProjectionMatrix()

		const a = new Mesh(
			new SphereGeometry(0.42, 24, 24),
			new MeshStandardNodeMaterial({
				color: "#3ec5f1"
			})
		)
		a.position.set(-1, 0, 0.2)
		const b = new Mesh(
			new BoxGeometry(0.65, 0.65, 0.65),
			new MeshStandardNodeMaterial({
				color: "#ffe08a"
			})
		)
		b.position.set(0.3, 0, -3)
		const c = new Mesh(
			new SphereGeometry(0.7, 24, 24),
			new MeshStandardNodeMaterial({
				color: "#ff7a93"
			})
		)
		c.position.set(1.5, 0.15, -8.5)
		scene.add(a, b, c)

		const scenePass = pass(
			scene,
			camera
		) as DerinlikGecisi
		const doku = scenePass.getTextureNode()
		const d = derinlikAl(scenePass)
		const odakNokta = uniform(0.28)
		const pipeline = new RenderPipeline(renderer)
		let aktif: Efekt = "sis"
		pipeline.outputNode = sis(doku, d)

		kontrolHtml(
			kontroller,
			`<button id="sis" type="button" class="aktif">Sis</button>
			<button id="renk" type="button">Depth renk</button>
			<button id="odak" type="button">Odak</button>
			<label>Odak
			<input id="odak-n" type="range" min="0"
			max="20" value="6" /></label>`
		)

		const uygula = (ad: Efekt): void => {
			aktif = ad
			if (ad === "sis") {
				pipeline.outputNode = sis(doku, d)
			} else if (ad === "renk") {
				pipeline.outputNode = derinlikRenk(doku, d)
			} else {
				pipeline.outputNode = odak(
					doku,
					d,
					odakNokta
				)
			}
			pipeline.needsUpdate = true
			for (const id of ["sis", "renk", "odak"]) {
				el<HTMLButtonElement>(
					kontroller,
					`#${id}`
				)?.classList.toggle("aktif", id === ad)
			}
		}

		el<HTMLButtonElement>(kontroller, "#sis")
			?.addEventListener("click", () => {
				uygula("sis")
			})
		el<HTMLButtonElement>(kontroller, "#renk")
			?.addEventListener("click", () => {
				uygula("renk")
			})
		el<HTMLButtonElement>(kontroller, "#odak")
			?.addEventListener("click", () => {
				uygula("odak")
			})
		el<HTMLInputElement>(kontroller, "#odak-n")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				odakNokta.value = Number(hedef.value) / 20
			})

		return {
			render: () => {
				pipeline.render()
			},
			update: () => {
				controls.update()
				istatistikEk.textContent =
					`${ky("efekt")}: ${kyVar(aktif)}`
			},
			dispose: () => {
				controls.dispose()
				pipeline.dispose()
				camera.near = 0.1
				camera.far = 200
				camera.updateProjectionMatrix()
			}
		}
	}
}

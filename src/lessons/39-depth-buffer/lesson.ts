import {
	BoxGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	RenderPipeline,
	SphereGeometry
} from "three/webgpu"
import {
	pass,
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

type DerinlikGecisi = TSLNode & {
	getLinearDepthNode: () => TSLNode
}

export const lesson: LessonModule = {
	id: "39",
	no: "39",
	title: "Depth Buffer",
	bolum: "Bölüm 17 — Depth",
	akis: "pass depth → 0..1 gri → near/far",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, camera, renderer } = app
		const controls = kameraSifirla(app, 2.6, 1.5, 5.2)
		temelIsik(scene)
		camera.near = 0.5
		camera.far = 24
		camera.updateProjectionMatrix()

		const yakin = new Mesh(
			new SphereGeometry(0.45, 24, 24),
			new MeshStandardNodeMaterial({
				color: "#3ec5f1"
			})
		)
		yakin.position.set(-0.9, 0, 0.4)

		const orta = new Mesh(
			new BoxGeometry(0.7, 0.7, 0.7),
			new MeshStandardNodeMaterial({
				color: "#ffcc33"
			})
		)
		orta.position.set(0.4, 0, -3.2)

		const uzak = new Mesh(
			new SphereGeometry(0.7, 24, 24),
			new MeshStandardNodeMaterial({
				color: "#ff6b6b"
			})
		)
		uzak.position.set(1.6, 0.2, -9)

		scene.add(yakin, orta, uzak)

		const scenePass = pass(
			scene,
			camera
		) as DerinlikGecisi
		const derinlik =
			typeof scenePass.getDepthNode === "function"
				? scenePass.getDepthNode()
				: scenePass.getLinearDepthNode()
		const pipeline = new RenderPipeline(renderer)
		pipeline.outputNode = vec4(
			derinlik,
			derinlik,
			derinlik,
			1
		)

		kontrolHtml(
			kontroller,
			`<label>Near
			<input id="near" type="range" min="1"
			max="40" value="5" /></label>
			<label>Far
			<input id="far" type="range" min="8"
			max="80" value="24" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#near")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				camera.near = Number(hedef.value) / 10
				if (camera.near >= camera.far) {
					camera.near = camera.far - 0.2
				}
				camera.updateProjectionMatrix()
			})

		el<HTMLInputElement>(kontroller, "#far")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				camera.far = Number(hedef.value)
				if (camera.far <= camera.near) {
					camera.far = camera.near + 0.2
				}
				camera.updateProjectionMatrix()
			})

		return {
			render: () => {
				pipeline.render()
			},
			update: () => {
				controls.update()
				istatistikEk.textContent =
					`near ${camera.near.toFixed(2)} · far ${camera.far.toFixed(1)}`
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

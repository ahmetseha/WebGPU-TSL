import {
	IcosahedronGeometry,
	Mesh,
	MeshStandardNodeMaterial,
	RenderPipeline,
	SphereGeometry
} from "three/webgpu"
import { mix, pass, vec3, vec4 } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "36",
	no: "36",
	title: "Post-processing mantığı",
	bolum: "Bölüm 16 — Post Processing",
	akis: "Sahne → Render Target → efekt → ekran",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, camera, renderer } = app
		const controls = kameraSifirla(app, 2.2, 1.4, 3.4)
		temelIsik(scene)

		const kure = new Mesh(
			new SphereGeometry(0.7, 32, 32),
			new MeshStandardNodeMaterial({
				color: "#3ec5f1"
			})
		)
		const kristal = new Mesh(
			new IcosahedronGeometry(0.35, 0),
			new MeshStandardNodeMaterial({
				color: "#ffcc33"
			})
		)
		kristal.position.set(1.2, 0.2, 0.2)
		scene.add(kure, kristal)

		const scenePass = pass(scene, camera)
		const sahneRenk = scenePass.getTextureNode()
		const tint = vec3(1, 0.78, 0.55)
		const pipeline = new RenderPipeline(renderer)
		pipeline.outputNode = mix(
			sahneRenk,
			vec4(tint, 1),
			0.22
		)

		kontrolHtml(
			kontroller,
			`<button id="tint" type="button" class="aktif">Tint kanıtı</button>`
		)

		let tintAcik = true
		el<HTMLButtonElement>(kontroller, "#tint")
			?.addEventListener("click", (event) => {
				tintAcik = !tintAcik
				pipeline.outputNode = tintAcik
					? mix(sahneRenk, vec4(tint, 1), 0.22)
					: sahneRenk
				pipeline.needsUpdate = true
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.toggle(
						"aktif",
						tintAcik
					)
			})

		return {
			render: () => {
				pipeline.render()
			},
			update: () => {
				controls.update()
				kure.rotation.y += 0.006
				kristal.rotation.y -= 0.01
				istatistikEk.textContent = tintAcik
					? "pass + tint"
					: "pass ham"
			},
			dispose: () => {
				controls.dispose()
				pipeline.dispose()
			}
		}
	}
}

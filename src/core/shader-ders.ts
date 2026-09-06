import {
	DoubleSide,
	Mesh,
	MeshBasicNodeMaterial,
	PlaneGeometry
} from "three/webgpu"
import type { TSLNode } from "three/tsl"
import { kameraSifirla } from "@/core/sahne"
import type { WebGPUApp } from "@/core/webgpu-app"
import type { LessonHandle } from "@/core/lesson"

export function shaderDuzlem(
	app: WebGPUApp,
	colorNode: TSLNode,
	boyut = 2
): LessonHandle {
	const controls = kameraSifirla(app, 0, 0, 2.8)
	app.camera.position.set(0, 0, 2.8)

	const material = new MeshBasicNodeMaterial()
	material.colorNode = colorNode
	material.side = DoubleSide

	const mesh = new Mesh(
		new PlaneGeometry(boyut, boyut),
		material
	)
	app.scene.add(mesh)

	return {
		update: () => {
			controls.update()
		},
		dispose: () => {
			controls.dispose()
		}
	}
}

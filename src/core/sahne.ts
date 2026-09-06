import {
	AmbientLight,
	DirectionalLight,
	type Object3D,
	type Scene
} from "three/webgpu"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import type { WebGPUApp } from "@/core/webgpu-app"

export function nesneyiTemizle(nesne: Object3D): void {
	const cocuklar = [...nesne.children]

	for (const cocuk of cocuklar) {
		nesneyiTemizle(cocuk)
		nesne.remove(cocuk)
	}

	const geo = (nesne as { geometry?: { dispose: () => void } })
		.geometry
	const mat = (nesne as { material?: unknown }).material

	if (geo !== undefined) {
		geo.dispose()
	}

	if (Array.isArray(mat)) {
		for (const m of mat) {
			if (
				m !== null &&
				typeof m === "object" &&
				"dispose" in m &&
				typeof m.dispose === "function"
			) {
				m.dispose()
			}
		}
	} else if (
		mat !== null &&
		typeof mat === "object" &&
		"dispose" in mat &&
		typeof mat.dispose === "function"
	) {
		mat.dispose()
	}
}

export function sahneyiTemizle(scene: Scene): void {
	const cocuklar = [...scene.children]

	for (const cocuk of cocuklar) {
		scene.remove(cocuk)
		nesneyiTemizle(cocuk)
	}
}

export function kameraSifirla(
	app: WebGPUApp,
	x = 2.4,
	y = 1.6,
	z = 3.2
): OrbitControls {
	const { camera, canvas } = app
	camera.position.set(x, y, z)
	camera.near = 0.1
	camera.far = 200
	camera.updateProjectionMatrix()

	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true
	controls.target.set(0, 0, 0)
	controls.update()

	return controls
}

export function temelIsik(scene: Scene): void {
	const ortam = new AmbientLight("#9eb3c7", 0.55)
	const yon = new DirectionalLight("#fff4e0", 1.4)
	yon.position.set(4, 6, 3)
	scene.add(ortam)
	scene.add(yon)
}

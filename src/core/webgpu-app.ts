import {
	Color,
	PerspectiveCamera,
	Scene,
	WebGPURenderer
} from "three/webgpu"

export type WebGPUApp = {
	renderer: WebGPURenderer
	scene: Scene
	camera: PerspectiveCamera
	canvas: HTMLCanvasElement
}

export type BackendAdi = "WebGPU" | "WebGL 2" | "Bilinmiyor"

export function getBackendAdi(
	renderer: WebGPURenderer
): BackendAdi {
	const { backend } = renderer

	if (backend.isWebGPUBackend === true) {
		return "WebGPU"
	}

	if (backend.isWebGLBackend === true) {
		return "WebGL 2"
	}

	return "Bilinmiyor"
}

export async function createWebGPUApp(
	canvas: HTMLCanvasElement
): Promise<WebGPUApp> {
	const renderer = new WebGPURenderer({
		canvas,
		antialias: true
	})

	await renderer.init()

	renderer.setPixelRatio(
		Math.min(window.devicePixelRatio, 2)
	)
	renderer.setSize(window.innerWidth, window.innerHeight)

	const scene = new Scene()
	scene.background = new Color("#111318")

	const camera = new PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		200
	)
	camera.position.set(2.6, 1.8, 3.4)

	const onResize = (): void => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	window.addEventListener("resize", onResize)

	return { renderer, scene, camera, canvas }
}

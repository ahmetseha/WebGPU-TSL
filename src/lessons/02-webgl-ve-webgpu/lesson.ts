import {
	BoxGeometry,
	Mesh,
	MeshBasicNodeMaterial
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

function backendAdi(
	isWebGPU: boolean | undefined,
	isWebGL: boolean | undefined
): string {
	if (isWebGPU === true) return "WebGPU"
	if (isWebGL === true) return "WebGL 2"
	return ky("bilinmiyor")
}

async function adapterOzet(): Promise<string> {
	const gpu = navigator.gpu

	if (gpu === undefined) {
		return ky("gpuYok")
	}

	const adapter = await gpu.requestAdapter()

	if (adapter === null) {
		return ky("adapterYok")
	}

	const { vendor, architecture, device } = adapter.info
	const yedek = adapter.info.isFallbackAdapter
		? "fallback"
		: "native"
	const v = vendor === "" ? "—" : vendor
	const a = architecture === "" ? "—" : architecture
	const d = device === "" ? "—" : device

	return `${v} / ${a} / ${d} (${yedek})`
}

export const lesson: LessonModule = {
	id: "02",
	no: "02",
	title: "WebGL ve WebGPU",
	bolum: "Bölüm 1 — GPU ve WebGPU temelleri",
	akis: "CPU → Queue → Command Buffer → Render Pass → Pipeline",
	notes,
	async start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app)
		const { backend } = renderer
		const ad = backendAdi(
			backend.isWebGPUBackend,
			backend.isWebGLBackend
		)

		const kup = new Mesh(
			new BoxGeometry(1, 1, 1),
			new MeshBasicNodeMaterial({ color: "#3ec5f1" })
		)
		scene.add(kup)

		kontrolHtml(
			kontroller,
			`<button id="backend-btn" type="button" class="aktif">
				Backend
			</button>
			<button id="gpu-btn" type="button">
				navigator.gpu
			</button>
			<button id="adapter-btn" type="button">
				adapter.info
			</button>`
		)

		const yaz = (metin: string): void => {
			istatistikEk.textContent = metin
		}

		yaz(`backend: ${ad}`)

		el<HTMLButtonElement>(kontroller, "#backend-btn")
			?.addEventListener("click", (event) => {
				yaz(`backend: ${ad}`)
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.add("aktif")
				el(kontroller, "#gpu-btn")
					?.classList.remove("aktif")
				el(kontroller, "#adapter-btn")
					?.classList.remove("aktif")
			})

		el<HTMLButtonElement>(kontroller, "#gpu-btn")
			?.addEventListener("click", (event) => {
				const varMi = navigator.gpu !== undefined
				yaz(varMi ? ky("gpuHazir") : ky("gpuYedek"))
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.add("aktif")
				el(kontroller, "#backend-btn")
					?.classList.remove("aktif")
				el(kontroller, "#adapter-btn")
					?.classList.remove("aktif")
			})

		el<HTMLButtonElement>(kontroller, "#adapter-btn")
			?.addEventListener("click", (event) => {
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.add("aktif")
				el(kontroller, "#backend-btn")
					?.classList.remove("aktif")
				el(kontroller, "#gpu-btn")
					?.classList.remove("aktif")
				void adapterOzet().then(yaz)
			})

		return {
			update: () => {
				controls.update()
				kup.rotation.y += 0.008
				kup.rotation.x += 0.003
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

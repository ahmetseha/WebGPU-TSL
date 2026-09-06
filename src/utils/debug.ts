import type { WebGPURenderer } from "three/webgpu"
import { getBackendAdi } from "@/core/webgpu-app"

export type EgitimDebug = {
	renderer: WebGPURenderer
	dersId: string
	info: () => WebGPURenderer["info"]
	backend: () => string
}

export function consolaYazdir(
	renderer: WebGPURenderer
): void {
	const { render, memory, compute } = renderer.info

	console.table({
		backend: getBackendAdi(renderer),
		"info.render.drawCalls": render.drawCalls,
		"info.render.triangles": render.triangles,
		"info.render.points": render.points,
		"info.render.lines": render.lines,
		"info.render.frameCalls": render.frameCalls,
		"info.render.calls": render.calls,
		"info.compute.frameCalls": compute.frameCalls,
		"info.memory.geometries": memory.geometries,
		"info.memory.textures": memory.textures
	})
}

export function debugAc(
	renderer: WebGPURenderer,
	dersId: string
): EgitimDebug {
	const paket: EgitimDebug = {
		renderer,
		dersId,
		info: () => renderer.info,
		backend: () => getBackendAdi(renderer)
	}

	Object.assign(window, { __egitim: paket })

	return paket
}

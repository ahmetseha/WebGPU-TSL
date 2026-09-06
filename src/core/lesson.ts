import type { WebGPUApp } from "@/core/webgpu-app"
import { metinleriUygula } from "@/i18n/kontrol"

export type LessonContext = {
	app: WebGPUApp
	kontroller: HTMLElement
	istatistikEk: HTMLElement
}

export type LessonHandle = {
	render?: () => void
	update?: (dt: number) => void
	dispose: () => void
}

export type LessonModule = {
	id: string
	no: string
	title: string
	bolum: string
	akis: string
	notes: string
	start: (
		ctx: LessonContext
	) => Promise<LessonHandle> | LessonHandle
}

export function kontrolHtml(
	kontroller: HTMLElement,
	html: string
): void {
	kontroller.innerHTML = html
	metinleriUygula(kontroller)
}

export function el<T extends HTMLElement>(
	kok: HTMLElement,
	secici: string
): T | null {
	const bulunan = kok.querySelector(secici)
	return bulunan instanceof HTMLElement
		? (bulunan as T)
		: null
}

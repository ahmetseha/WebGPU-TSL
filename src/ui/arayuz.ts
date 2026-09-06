import { dersBolum, dersBaslik } from "@/i18n/ders-en"
import {
	dilAl,
	dilAyarla,
	dilDinle,
	type Dil
} from "@/i18n/dil"
import { t } from "@/i18n/metin"
import type { LessonModule } from "@/core/lesson"

export function arayuzuUygula(
	dil: Dil,
	dersler?: LessonModule[],
	aktifId?: string
): void {
	const sozluk = t(dil)
	document.title = sozluk.belgeBaslik
	document.documentElement.lang = dil

	document
		.querySelectorAll<HTMLElement>("[data-i18n]")
		.forEach((el) => {
			const anahtar = el.dataset.i18n as keyof typeof sozluk
			const deger = sozluk[anahtar]
			if (typeof deger === "string") {
				el.textContent = deger
			}
		})

	document
		.querySelectorAll<HTMLElement>("[data-i18n-aria]")
		.forEach((el) => {
			const anahtar = el.dataset
				.i18nAria as keyof typeof sozluk
			const deger = sozluk[anahtar]
			if (typeof deger === "string") {
				el.setAttribute("aria-label", deger)
			}
		})

	document
		.querySelectorAll<HTMLButtonElement>("[data-dil]")
		.forEach((dugme) => {
			dugme.classList.toggle(
				"aktif",
				dugme.dataset.dil === dil
			)
		})

	const ozellikler = document.getElementById("ozellikler")
	if (ozellikler !== null) {
		ozellikler.innerHTML = sozluk.ozellikler
			.map((madde) => `<li>${madde}</li>`)
			.join("")
	}

	if (dersler !== undefined) {
		secenekleriDoldur(dersler, dil, aktifId)
	}
}

export function secenekleriDoldur(
	dersler: LessonModule[],
	dil: Dil,
	aktifId?: string
): void {
	const secici = document.getElementById("ders-sec")
	if (!(secici instanceof HTMLSelectElement)) {
		return
	}

	const secili = aktifId ?? secici.value
	secici.replaceChildren()

	for (const ders of dersler) {
		const opt = document.createElement("option")
		opt.value = ders.id
		const title =
			dil === "en"
				? dersBaslik(ders.id, ders.title)
				: ders.title
		opt.textContent = `${ders.no} — ${title}`
		secici.append(opt)
	}

	if (secili !== "") {
		secici.value = secili
	}
}

export function dersMetni(
	ders: LessonModule,
	dil: Dil
): { title: string; bolum: string } {
	if (dil === "en") {
		return {
			title: dersBaslik(ders.id, ders.title),
			bolum: dersBolum(ders.id, ders.bolum)
		}
	}

	return { title: ders.title, bolum: ders.bolum }
}

export function dilDugmeleriniBagla(): void {
	document
		.querySelectorAll<HTMLButtonElement>("[data-dil]")
		.forEach((dugme) => {
			dugme.addEventListener("click", () => {
				const dil = dugme.dataset.dil
				if (dil === "tr" || dil === "en") {
					dilAyarla(dil)
				}
			})
		})

	dilDinle((dil) => {
		arayuzuUygula(dil)
	})

	arayuzuUygula(dilAl())
}

import "@/style.css"
import {
	egitimiBaslat,
	type EgitimKumanda
} from "@/core/runner"
import {
	dilAl,
	dilDinle,
	sonDersiAl
} from "@/i18n/dil"
import { t } from "@/i18n/metin"
import { dersler } from "@/lessons/katalog"
import { arayuzuUygula, dilDugmeleriniBagla } from "@/ui/arayuz"

const hataKutusu = document.getElementById("hata")
const karsilama = document.getElementById("karsilama")
const uygulama = document.getElementById("uygulama")
const canvas = document.getElementById("sahne")
const baslat = document.getElementById("baslat")
const devam = document.getElementById("devam")
const anasayfa = document.getElementById("anasayfa")

let kumanda: EgitimKumanda | null = null

dilDugmeleriniBagla()

const devamGuncelle = (): void => {
	if (devam instanceof HTMLButtonElement) {
		devam.hidden = sonDersiAl() === null
	}
}

devamGuncelle()
dilDinle(devamGuncelle)

const dersEkraniAc = (): void => {
	karsilama?.setAttribute("hidden", "")
	uygulama?.removeAttribute("hidden")
	canvas?.removeAttribute("hidden")
	document.body.classList.add("ders-mod")
}

const anaSayfaAc = (): void => {
	kumanda?.duraklat()
	uygulama?.setAttribute("hidden", "")
	canvas?.setAttribute("hidden", "")
	karsilama?.removeAttribute("hidden")
	document.body.classList.remove("ders-mod")
	arayuzuUygula(dilAl())
	devamGuncelle()
}

const baslatEgitim = (id?: string): void => {
	dersEkraniAc()

	if (kumanda !== null) {
		kumanda.surdur()
		if (id !== undefined) {
			void kumanda.dersYukle(id)
		}
		return
	}

	egitimiBaslat(dersler, id)
		.then((sonuc) => {
			kumanda = sonuc
		})
		.catch((error: unknown) => {
			console.error(error)

			if (hataKutusu !== null) {
				hataKutusu.hidden = false
				hataKutusu.textContent =
					error instanceof Error
						? error.message
						: t(dilAl()).yukleniyor
			}
		})
}

baslat?.addEventListener("click", () => {
	baslatEgitim("01")
})

devam?.addEventListener("click", () => {
	baslatEgitim(sonDersiAl() ?? "01")
})

anasayfa?.addEventListener("click", () => {
	anaSayfaAc()
})

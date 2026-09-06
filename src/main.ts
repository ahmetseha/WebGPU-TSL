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
import {
	dersSahnesiCikis,
	dersSahnesiGiris,
	dilGostergesiniGuncelle,
	hareketiKur,
	karsilamaCikis,
	karsilamaGiris,
	ozellikleriOynat
} from "@/ui/hareket"

const hataKutusu = document.getElementById("hata")
const karsilama = document.getElementById("karsilama")
const uygulama = document.getElementById("uygulama")
const canvas = document.getElementById("sahne")
const baslat = document.getElementById("baslat")
const devam = document.getElementById("devam")
const anasayfa = document.getElementById("anasayfa")

let kumanda: EgitimKumanda | null = null
let gecisVar = false

dilDugmeleriniBagla()
hareketiKur()
void karsilamaGiris()

const devamGuncelle = (): void => {
	if (devam instanceof HTMLButtonElement) {
		devam.hidden = sonDersiAl() === null
	}
}

devamGuncelle()
dilDinle(() => {
	devamGuncelle()
	dilGostergesiniGuncelle()
	if (!document.body.classList.contains("ders-mod")) {
		ozellikleriOynat()
	}
})

const dersEkraniAc = async (): Promise<void> => {
	if (gecisVar || document.body.classList.contains("ders-mod")) {
		return
	}

	gecisVar = true
	await karsilamaCikis()
	karsilama?.setAttribute("hidden", "")
	uygulama?.removeAttribute("hidden")
	canvas?.removeAttribute("hidden")
	document.body.classList.add("ders-mod")
	await dersSahnesiGiris()
	gecisVar = false
}

const anaSayfaAc = (): void => {
	if (gecisVar || !document.body.classList.contains("ders-mod")) {
		return
	}

	void (async () => {
		gecisVar = true
		kumanda?.duraklat()
		await dersSahnesiCikis()
		uygulama?.setAttribute("hidden", "")
		canvas?.setAttribute("hidden", "")
		karsilama?.removeAttribute("hidden")
		document.body.classList.remove("ders-mod")
		arayuzuUygula(dilAl())
		devamGuncelle()
		dilGostergesiniGuncelle()
		await karsilamaGiris()
		gecisVar = false
	})()
}

const baslatEgitim = (id?: string): void => {
	void dersEkraniAc().then(() => {
		if (kumanda !== null) {
			kumanda.surdur()
			if (id !== undefined) {
				void kumanda.dersYukle(id)
			}
		}
	})

	if (kumanda !== null) {
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

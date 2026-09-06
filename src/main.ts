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
let gecisNesil = 0

dilDugmeleriniBagla()
hareketiKur()

const hashDersAl = (): string | undefined => {
	const id = location.hash.replace("#", "")
	return dersler.find((d) => d.id === id)?.id
}

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

const kareBekle = (): Promise<void> =>
	new Promise((coz) => {
		requestAnimationFrame(() => {
			coz()
		})
	})

const dersModunda = (): boolean =>
	document.body.classList.contains("ders-mod")

const dersEkraniAc = async (
	aninda = false
): Promise<void> => {
	if (dersModunda()) {
		return
	}

	const nesil = ++gecisNesil
	if (!aninda) {
		await karsilamaCikis()
		if (nesil !== gecisNesil) {
			return
		}
	}

	karsilama?.setAttribute("hidden", "")
	if (karsilama !== null) {
		karsilama.style.opacity = ""
		karsilama.style.transform = ""
	}
	uygulama?.removeAttribute("hidden")
	canvas?.removeAttribute("hidden")
	document.body.classList.add("ders-mod")
	await dersSahnesiGiris()
}

const anaSayfaAc = (): void => {
	if (!dersModunda() && uygulama?.hasAttribute("hidden")) {
		return
	}

	const nesil = ++gecisNesil

	void (async () => {
		kumanda?.duraklat()
		await dersSahnesiCikis()
		if (nesil !== gecisNesil) {
			return
		}

		uygulama?.setAttribute("hidden", "")
		canvas?.setAttribute("hidden", "")
		if (karsilama !== null) {
			karsilama.style.opacity = "1"
			karsilama.style.transform = "none"
			karsilama.removeAttribute("hidden")
		}
		document.body.classList.remove("ders-mod")
		history.replaceState(
			null,
			"",
			`${location.pathname}${location.search}`
		)
		arayuzuUygula(dilAl())
		devamGuncelle()
		dilGostergesiniGuncelle()
		await kareBekle()
		if (nesil !== gecisNesil) {
			return
		}
		await karsilamaGiris()
	})()
}

const baslatEgitim = (
	id?: string,
	aninda = false
): void => {
	void dersEkraniAc(aninda).then(() => {
		if (!dersModunda()) {
			return
		}

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
			if (!dersModunda()) {
				kumanda.duraklat()
			}
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

window.addEventListener("hashchange", () => {
	const dersId = hashDersAl()
	if (dersId !== undefined && !dersModunda()) {
		baslatEgitim(dersId, true)
		return
	}
	if (dersId === undefined && dersModunda()) {
		anaSayfaAc()
	}
})

const acilisDers = hashDersAl()
if (acilisDers !== undefined) {
	karsilama?.setAttribute("hidden", "")
	baslatEgitim(acilisDers, true)
} else {
	void karsilamaGiris()
}

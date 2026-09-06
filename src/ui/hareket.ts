import { animate, hover, press, stagger } from "motion"

const yumusak = [0.22, 1, 0.36, 1] as const

const yay = {
	type: "spring" as const,
	stiffness: 380,
	damping: 28
}

type Oynatma = {
	finished: Promise<unknown>
}

const azalsin = (): boolean =>
	window.matchMedia("(prefers-reduced-motion: reduce)")
		.matches

const mobil = (): boolean =>
	window.matchMedia("(max-width: 900px)").matches

const elAl = (id: string): HTMLElement | null =>
	document.getElementById(id)

const liste = (secici: string): HTMLElement[] =>
	[...document.querySelectorAll<HTMLElement>(secici)]

const stilleriSifirla = (el: HTMLElement): void => {
	el.style.opacity = ""
	el.style.transform = ""
	el.style.filter = ""
}

const anindaGoster = (hedefler: HTMLElement[]): void => {
	for (const el of hedefler) {
		el.style.opacity = "1"
		el.style.transform = "none"
	}
}

const bekle = async (oynatma: Oynatma): Promise<void> => {
	await oynatma.finished
}

let dilIlk = true

export function hareketiKur(): void {
	document.documentElement.classList.add("hareket")
	selectOkuBagla()
	dilGostergesiniGuncelle()
	dugmeHareketleriniBagla()
}

function dugmeHareketleriniBagla(): void {
	if (azalsin()) {
		return
	}

	const secici =
		".birincil, .ikincil, .gezgin > button, #hud button, #notlar button"

	hover(secici, (hedef) => {
		void animate(
			hedef,
			{ y: -2, scale: 1.02 },
			{ type: "spring", stiffness: 420, damping: 24 }
		)

		return () => {
			void animate(
				hedef,
				{ y: 0, scale: 1 },
				{ type: "spring", stiffness: 380, damping: 26 }
			)
		}
	})

	press(secici, (hedef) => {
		void animate(hedef, { scale: 0.97 }, { duration: 0.1 })

		return () => {
			void animate(hedef, { scale: 1 }, yay)
		}
	})
}

function selectOkuBagla(): void {
	const secici = elAl("ders-sec")
	const ok = document.querySelector(".ders-sec-ok")

	if (
		!(secici instanceof HTMLSelectElement) ||
		!(ok instanceof HTMLElement)
	) {
		return
	}

	const oyna = (acik: boolean): void => {
		ok.classList.toggle("acik", acik)

		if (azalsin()) {
			return
		}

		void animate(
			ok,
			{ rotate: acik ? 180 : 0 },
			{ type: "spring", stiffness: 420, damping: 22 }
		)
	}

	secici.addEventListener("focus", () => {
		oyna(true)
	})
	secici.addEventListener("blur", () => {
		oyna(false)
	})
}

export function dilGostergesiniGuncelle(): void {
	for (const grup of liste(".dil-switch")) {
		const aktif = grup.querySelector("button.aktif")
		const gosterge = grup.querySelector(".dil-gosterge")

		if (
			!(aktif instanceof HTMLElement) ||
			!(gosterge instanceof HTMLElement)
		) {
			continue
		}

		const x = aktif.offsetLeft
		const genislik = aktif.offsetWidth

		if (azalsin() || dilIlk) {
			gosterge.style.width = `${genislik}px`
			gosterge.style.transform = `translateX(${x}px)`
			continue
		}

		void animate(
			gosterge,
			{ x, width: genislik },
			yay
		)
	}

	dilIlk = false
}

export async function karsilamaGiris(): Promise<void> {
	const ust = document.querySelector(".karsilama-ust")
	const parcalar = liste(".karsilama-govde > *")
	const hedefler = [
		...(ust instanceof HTMLElement ? [ust] : []),
		...parcalar
	]

	if (hedefler.length === 0) {
		return
	}

	if (azalsin()) {
		anindaGoster(hedefler)
		return
	}

	if (ust instanceof HTMLElement) {
		void animate(
			ust,
			{ opacity: [0, 1], y: [-8, 0] },
			{ duration: 0.4, ease: yumusak }
		)
	}

	await bekle(
		animate(
			parcalar,
			{ opacity: [0, 1], y: [18, 0] },
			{
				delay: stagger(0.055, { startDelay: 0.06 }),
				duration: 0.5,
				ease: yumusak
			}
		)
	)
}

export async function karsilamaCikis(): Promise<void> {
	const panel = elAl("karsilama")

	if (panel === null) {
		return
	}

	if (azalsin()) {
		return
	}

	await bekle(
		animate(
			panel,
			{ opacity: 0, y: -10 },
			{ duration: 0.28, ease: yumusak }
		)
	)
	stilleriSifirla(panel)
}

const kromSecici = ".baslik, .gezgin, #hud"

const kromAl = (): HTMLElement[] => liste(kromSecici)

export async function dersSahnesiGiris(): Promise<void> {
	const krom = kromAl()
	const notlar = elAl("notlar")
	const ilerleme = elAl("ilerleme")

	if (ilerleme !== null) {
		ilerleme.hidden = false
	}

	const hedefler = [
		...krom,
		...(notlar !== null &&
		!notlar.classList.contains("kapali")
			? [notlar]
			: [])
	]

	if (azalsin()) {
		anindaGoster(hedefler)
		if (ilerleme !== null) {
			ilerleme.style.opacity = "1"
		}
		return
	}

	if (ilerleme !== null) {
		void animate(
			ilerleme,
			{ opacity: [0, 1] },
			{ duration: 0.35, ease: yumusak }
		)
	}

	await bekle(
		animate(
			krom,
			{ opacity: [0, 1], y: [14, 0] },
			{
				delay: stagger(0.055),
				duration: 0.46,
				ease: yumusak
			}
		)
	)

	if (
		notlar !== null &&
		!notlar.classList.contains("kapali")
	) {
		void notlariAc()
	}
}

export async function dersSahnesiCikis(): Promise<void> {
	const krom = kromAl()
	const notlar = elAl("notlar")
	const ilerleme = elAl("ilerleme")
	const hedefler = [
		...krom,
		...(notlar !== null &&
		!notlar.classList.contains("kapali")
			? [notlar]
			: [])
	]

	if (azalsin()) {
		if (ilerleme !== null) {
			ilerleme.hidden = true
		}
		return
	}

	if (ilerleme !== null) {
		void animate(
			ilerleme,
			{ opacity: 0 },
			{ duration: 0.2 }
		)
	}

	if (hedefler.length > 0) {
		await bekle(
			animate(
				hedefler,
				{ opacity: 0, y: -8 },
				{
					delay: stagger(0.03),
					duration: 0.22,
					ease: yumusak
				}
			)
		)
	}

	for (const el of hedefler) {
		stilleriSifirla(el)
	}

	if (ilerleme !== null) {
		ilerleme.hidden = true
		ilerleme.style.opacity = ""
	}
}

export async function notlariAc(): Promise<void> {
	const panel = elAl("notlar")

	if (panel === null) {
		return
	}

	panel.classList.remove("kapali")
	panel.style.visibility = "visible"
	panel.style.pointerEvents = "auto"

	if (azalsin()) {
		panel.style.opacity = "1"
		panel.style.transform = "none"
		return
	}

	const kayma = mobil()
		? { y: [22, 0], x: 0 }
		: { x: [24, 0], y: 0 }

	await bekle(
		animate(
			panel,
			{ opacity: [0, 1], ...kayma },
			{
				type: "spring",
				visualDuration: 0.42,
				bounce: 0.16
			}
		)
	)
}

export async function notlariKapat(): Promise<void> {
	const panel = elAl("notlar")

	if (panel === null) {
		return
	}

	if (!azalsin()) {
		const kayma = mobil()
			? { y: 16, x: 0 }
			: { x: 18, y: 0 }

		await bekle(
			animate(
				panel,
				{ opacity: 0, ...kayma },
				{ duration: 0.2, ease: yumusak }
			)
		)
	}

	panel.classList.add("kapali")
	panel.style.visibility = ""
	panel.style.pointerEvents = ""
	stilleriSifirla(panel)
}

export function notlariDegistir(): void {
	const panel = elAl("notlar")

	if (panel === null) {
		return
	}

	if (panel.classList.contains("kapali")) {
		void notlariAc()
		return
	}

	void notlariKapat()
}

export function ilerlemeyiGuncelle(
	sira: number,
	toplam: number
): void {
	const cubuk = elAl("ilerleme-cubuk")
	const yazi = elAl("ders-adim")
	const oran = toplam === 0 ? 0 : sira / toplam

	if (yazi !== null) {
		yazi.textContent = `${sira} / ${toplam}`
	}

	if (cubuk === null) {
		return
	}

	if (azalsin()) {
		cubuk.style.transform = `scaleX(${oran})`
		return
	}

	void animate(
		cubuk,
		{ scaleX: oran },
		{
			type: "spring",
			visualDuration: 0.45,
			bounce: 0
		}
	)
}

export function baslikOynat(): void {
	const baslik = elAl("ders-baslik")
	const no = elAl("ders-no")

	if (azalsin()) {
		return
	}

	if (baslik !== null) {
		void animate(
			baslik,
			{ opacity: [0.35, 1], y: [6, 0] },
			{ duration: 0.28, ease: yumusak }
		)
	}

	if (no !== null) {
		void animate(
			no,
			{ opacity: [0.35, 1] },
			{ duration: 0.22, ease: yumusak }
		)
	}
}

export function ozellikleriOynat(): void {
	const maddeler = liste("#ozellikler li")

	if (maddeler.length === 0 || azalsin()) {
		return
	}

	void animate(
		maddeler,
		{ opacity: [0, 1], y: [8, 0] },
		{
			delay: stagger(0.04),
			duration: 0.32,
			ease: yumusak
		}
	)
}

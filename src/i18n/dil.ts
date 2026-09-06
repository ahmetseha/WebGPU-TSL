export type Dil = "tr" | "en"

const ANAHTAR = "webgpu-tsl-dil"
const DERS_ANAHTAR = "webgpu-tsl-ders"

const dinleyiciler = new Set<(dil: Dil) => void>()

function tarayiciDili(): Dil {
	const kayit = localStorage.getItem(ANAHTAR)
	if (kayit === "tr" || kayit === "en") {
		return kayit
	}

	return navigator.language.toLowerCase().startsWith("tr")
		? "tr"
		: "en"
}

let aktif: Dil = tarayiciDili()

export function dilAl(): Dil {
	return aktif
}

export function dilAyarla(dil: Dil): void {
	aktif = dil
	localStorage.setItem(ANAHTAR, dil)
	document.documentElement.lang = dil
	for (const fn of dinleyiciler) {
		fn(dil)
	}
}

export function dilDinle(
	fn: (dil: Dil) => void
): () => void {
	dinleyiciler.add(fn)
	return () => {
		dinleyiciler.delete(fn)
	}
}

export function sonDersiAl(): string | null {
	return localStorage.getItem(DERS_ANAHTAR)
}

export function sonDersiYaz(id: string): void {
	localStorage.setItem(DERS_ANAHTAR, id)
}

dilAyarla(aktif)

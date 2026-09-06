export type Dil = "tr" | "en"

const ANAHTAR = "webgpu-tsl-dil"
const DERS_ANAHTAR = "webgpu-tsl-ders"

// TR geçici kapalı. Açmak için SABIT_DIL'i kaldır,
// tarayiciDili'ni geri getir, index.html dil-switch
// yorumlarını aç.
const SABIT_DIL: Dil = "en"

const dinleyiciler = new Set<(dil: Dil) => void>()

function tarayiciDili(): Dil {
	return SABIT_DIL
	/*
	const kayit = localStorage.getItem(ANAHTAR)
	if (kayit === "tr" || kayit === "en") {
		return kayit
	}

	return navigator.language.toLowerCase().startsWith("tr")
		? "tr"
		: "en"
	*/
}

let aktif: Dil = tarayiciDili()

export function dilAl(): Dil {
	return aktif
}

export function dilAyarla(_dil: Dil): void {
	aktif = SABIT_DIL
	localStorage.setItem(ANAHTAR, SABIT_DIL)
	document.documentElement.lang = SABIT_DIL
	for (const fn of dinleyiciler) {
		fn(SABIT_DIL)
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

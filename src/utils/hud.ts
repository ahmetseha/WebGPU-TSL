export function yaziYaz(
	id: string,
	deger: string | number
): void {
	const el = document.getElementById(id)

	if (el === null) {
		return
	}

	el.textContent = String(deger)
}

export function dugmeDurumu(
	kok: ParentNode,
	id: string,
	aktif: boolean
): void {
	const el = kok.querySelector(`#${id}`)

	if (!(el instanceof HTMLElement)) {
		return
	}

	el.setAttribute("aria-pressed", String(aktif))
	el.classList.toggle("aktif", aktif)
}

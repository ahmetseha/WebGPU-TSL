const ham = import.meta.glob("../lessons/*/notlar.en.md", {
	query: "?raw",
	import: "default",
	eager: true
}) as Record<string, string>

export function notEnAl(id: string): string | undefined {
	const anahtar = Object.keys(ham).find((yol) =>
		yol.includes(`/lessons/${id}-`)
	)

	if (anahtar === undefined) {
		return undefined
	}

	return ham[anahtar]
}

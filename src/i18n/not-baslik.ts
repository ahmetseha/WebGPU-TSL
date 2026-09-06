import type { Dil } from "@/i18n/dil"

const basliklar: Record<string, string> = {
	Konu: "Topic",
	Mantık: "How it works",
	Kod: "Code",
	Deney: "Try this",
	"Browser DevTools": "Browser DevTools",
	"Mini görev": "Mini task",
	Tekrar: "Recap"
}

export function notBasliklariniCevir(
	markdown: string,
	dil: Dil
): string {
	if (dil === "tr") {
		return markdown
	}

	return markdown.replace(
		/^(#{1,3}) (.+)$/gm,
		(_tum, hashes: string, baslik: string) => {
			const ceviri = basliklar[baslik]
			return `${hashes} ${ceviri ?? baslik}`
		}
	)
}

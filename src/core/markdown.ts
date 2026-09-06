function kacir(metin: string): string {
	return metin
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
}

function satiriIsle(satir: string): string {
	return kacir(satir)
		.replace(
			/`([^`]+)`/g,
			"<code>$1</code>"
		)
		.replace(
			/\*\*([^*]+)\*\*/g,
			"<strong>$1</strong>"
		)
		.replace(
			/\*([^*]+)\*/g,
			"<em>$1</em>"
		)
}

export function markdownToHtml(kaynak: string): string {
	const satirlar = kaynak.replaceAll("\r\n", "\n").split("\n")
	const cikti: string[] = []
	let liste = false
	let kod = false
	const kodSatirlari: string[] = []

	const listeKapat = (): void => {
		if (liste) {
			cikti.push("</ul>")
			liste = false
		}
	}

	for (const satir of satirlar) {
		if (satir.startsWith("```")) {
			if (kod) {
				cikti.push(
					`<pre><code>${kacir(kodSatirlari.join("\n"))}</code></pre>`
				)
				kodSatirlari.length = 0
				kod = false
			} else {
				listeKapat()
				kod = true
			}
			continue
		}

		if (kod) {
			kodSatirlari.push(satir)
			continue
		}

		if (satir.startsWith("### ")) {
			listeKapat()
			cikti.push(`<h3>${satiriIsle(satir.slice(4))}</h3>`)
			continue
		}

		if (satir.startsWith("## ")) {
			listeKapat()
			cikti.push(`<h2>${satiriIsle(satir.slice(3))}</h2>`)
			continue
		}

		if (satir.startsWith("# ")) {
			listeKapat()
			cikti.push(`<h1>${satiriIsle(satir.slice(2))}</h1>`)
			continue
		}

		if (satir.startsWith("- ") || satir.startsWith("* ")) {
			if (!liste) {
				cikti.push("<ul>")
				liste = true
			}
			cikti.push(`<li>${satiriIsle(satir.slice(2))}</li>`)
			continue
		}

		if (satir.trim() === "") {
			listeKapat()
			continue
		}

		listeKapat()
		cikti.push(`<p>${satiriIsle(satir)}</p>`)
	}

	listeKapat()

	if (kod) {
		cikti.push(
			`<pre><code>${kacir(kodSatirlari.join("\n"))}</code></pre>`
		)
	}

	return cikti.join("\n")
}

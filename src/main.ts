import "@/style.css"
import { egitimiBaslat } from "@/core/runner"
import { dersler } from "@/lessons/katalog"

const hataKutusu = document.getElementById("hata")

egitimiBaslat(dersler).catch((error: unknown) => {
	console.error(error)

	if (hataKutusu !== null) {
		hataKutusu.hidden = false
		hataKutusu.textContent =
			error instanceof Error
				? error.message
				: "Eğitim başlatılamadı."
	}
})

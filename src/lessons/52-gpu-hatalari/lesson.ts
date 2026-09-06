import {
	Color,
	Mesh,
	MeshStandardNodeMaterial,
	SphereGeometry
} from "three/webgpu"
import { uniform } from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

export const lesson: LessonModule = {
	id: "52",
	no: "52",
	title: "GPU hataları",
	bolum: "Bölüm 27 — GPU hataları",
	akis: "validation → Console.warn · sekmeyi düşürme",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 2.2, 1.4, 2.8)
		scene.background = new Color("#1a1214")
		temelIsik(scene)

		const kure = new Mesh(
			new SphereGeometry(0.75, 20, 20),
			new MeshStandardNodeMaterial({
				color: "#e07070",
				roughness: 0.45
			})
		)
		scene.add(kure)

		let son = "Henüz örnek yok — düğmeye bas."
		const yaz = (metin: string): void => {
			son = metin
			console.warn(metin)
			const kutu = el<HTMLElement>(kontroller, "#gunluk")
			if (kutu !== null) {
				kutu.textContent = metin
			}
		}

		istatistikEk.innerHTML =
			"<p>Sekmeyi kırmayız. Console.warn örnekleri.</p>"

		kontrolHtml(
			kontroller,
			`<button id="gpu" type="button">navigator.gpu</button>
			<button id="shader" type="button">Shader derleme</button>
			<button id="buffer" type="button">Geçersiz buffer</button>
			<button id="bind" type="button">Binding</button>
			<button id="pipe" type="button">Pipeline</button>
			<button id="lost" type="button">Device lost</button>
			<button id="oom" type="button">OOM</button>
			<button id="valid" type="button">Validation</button>
			<p id="gunluk">${son}</p>`
		)

		el<HTMLButtonElement>(kontroller, "#gpu")
			?.addEventListener("click", () => {
				if (navigator.gpu === undefined) {
					yaz(
						"navigator.gpu yok. WebGPU kapalı " +
							"veya destek yok. Fallback WebGL2."
					)
					return
				}
				yaz(
					"navigator.gpu var. Adapter isteği güvenli; sekmeyi düşürmez."
				)
				void navigator.gpu.requestAdapter().then((a) => {
					console.info("adapter", a)
				})
			})

		el<HTMLButtonElement>(kontroller, "#shader")
			?.addEventListener("click", () => {
				yaz(
					"Shader compile: TSL → WGSL. Hata " +
						"Console’da kırmızı [WebGPU]. " +
						"Bu demo derlemeyi bozmaz."
				)
			})

		el<HTMLButtonElement>(kontroller, "#buffer")
			?.addEventListener("click", () => {
				yaz(
					"Invalid buffer: boyut veya usage " +
						"uyuşmaz. Console: validation. " +
						"Sayfa genelde açık kalır."
				)
			})

		el<HTMLButtonElement>(kontroller, "#bind")
			?.addEventListener("click", () => {
				yaz(
					"Binding: layout ≠ resource tipi. " +
						"Görüntü kaybolur veya kırmızı log."
				)
			})

		el<HTMLButtonElement>(kontroller, "#pipe")
			?.addEventListener("click", () => {
				yaz(
					"Pipeline validation: vertex format " +
						"shader ile uyuşmaz. CreateRenderPipeline " +
						"başarısız log’u."
				)
			})

		el<HTMLButtonElement>(kontroller, "#lost")
			?.addEventListener("click", () => {
				yaz(
					"device lost: sürücü reset / timeout. " +
						"renderer durur. Sayfayı yenile. " +
						"GPU.process crash ayrıdır."
				)
			})

		el<HTMLButtonElement>(kontroller, "#oom")
			?.addEventListener("click", () => {
				yaz(
					"OOM: çok büyük buffer/texture. " +
						"8K dizi üretmiyoruz — sekme şişmesin."
				)
			})

		el<HTMLButtonElement>(kontroller, "#valid")
			?.addEventListener("click", () => {
				try {
					const bozuk = uniform({ x: "metin" })
					console.info(
						"uniform sarmaladı (JS); GPU tipi sonra doğrulanır",
						bozuk
					)
					yaz(
						"Zararsız geçersiz uniform: JS nesne. " +
							"Asıl validation render anında."
					)
				} catch (hata: unknown) {
					const mesaj =
						hata instanceof Error
							? hata.message
							: "bilinmeyen"
					yaz(`Uniform fırlattı: ${mesaj}`)
				}
			})

		return {
			update: () => {
				controls.update()
				kure.rotation.y += 0.01
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

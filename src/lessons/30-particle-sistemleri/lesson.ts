import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Points,
	PointsMaterial
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

const AZAMI = 12000

function noktaBulut(
	adet: number
): { noktalar: Points; konumlar: Float32Array } {
	const konumlar = new Float32Array(adet * 3)

	for (let i = 0; i < adet; i++) {
		const i3 = i * 3
		konumlar[i3] = (Math.random() - 0.5) * 6
		konumlar[i3 + 1] = (Math.random() - 0.5) * 6
		konumlar[i3 + 2] = (Math.random() - 0.5) * 6
	}

	const geo = new BufferGeometry()
	geo.setAttribute(
		"position",
		new BufferAttribute(konumlar, 3)
	)

	const malzeme = new PointsMaterial({
		color: "#ffcc66",
		size: 0.045,
		sizeAttenuation: true
	})
	malzeme.transparent = true
	malzeme.depthWrite = false
	malzeme.blending = AdditiveBlending

	return {
		noktalar: new Points(geo, malzeme),
		konumlar
	}
}

export const lesson: LessonModule = {
	id: "30",
	no: "30",
	title: "Particle sistemleri",
	bolum: "Bölüm 14 — Particles",
	akis: "CPU dizi → Attribute → Points → 1 draw call",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 1.4, 7)
		let adet = 4000
		let cpuYaz = true
		let zaman = 0
		let { noktalar, konumlar } = noktaBulut(adet)
		scene.add(noktalar)
		Object.assign(noktalar, { frustumCulled: false })

		kontrolHtml(
			kontroller,
			`<label>Adet
			<input id="adet" type="range" min="200"
			max="${AZAMI}" value="${adet}" /></label>
			<button id="cpu" type="button" class="aktif">
			CPU yaz</button>`
		)

		const yenile = (yeniAdet: number): void => {
			scene.remove(noktalar)
			noktalar.geometry.dispose()
			noktalar.material.dispose()
			adet = yeniAdet
			const yeni = noktaBulut(adet)
			noktalar = yeni.noktalar
			konumlar = yeni.konumlar
			Object.assign(noktalar, { frustumCulled: false })
			scene.add(noktalar)
		}

		el<HTMLInputElement>(kontroller, "#adet")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				yenile(Number(hedef.value))
			})

		el<HTMLButtonElement>(kontroller, "#cpu")
			?.addEventListener("click", (event) => {
				cpuYaz = !cpuYaz
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.toggle(
						"aktif",
						cpuYaz
					)
			})

		return {
			update: (dt) => {
				controls.update()
				zaman += dt
				istatistikEk.textContent = ky(
					"noktaPoints",
					{ n: adet }
				)

				if (!cpuYaz) {
					return
				}

				for (let i = 0; i < adet; i++) {
					const i3 = i * 3
					const x = konumlar[i3] ?? 0
					const z = konumlar[i3 + 2] ?? 0
					konumlar[i3 + 1] =
						Math.sin(zaman + x * 0.8 + z) * 0.35
				}

				const attr =
					noktalar.geometry.attributes["position"]
				if (attr !== undefined) {
					attr.needsUpdate = true
				}
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

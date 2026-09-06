import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Points,
	PointsNodeMaterial
} from "three/webgpu"
import {
	cos,
	Fn,
	floor,
	hash,
	instanceIndex,
	mix,
	sin,
	uniform,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

const ADET = 9000

type SayiliNokta = Points & { count: number }

function bosGeo(): BufferGeometry {
	const geo = new BufferGeometry()
	geo.setAttribute(
		"position",
		new BufferAttribute(new Float32Array(3), 3)
	)
	return geo
}

export const lesson: LessonModule = {
	id: "32",
	no: "32",
	title: "Galaxy",
	bolum: "Bölüm 14 — Particles",
	akis: "yarıçap → kol açısı + burgu → spiral",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 5.5, 7.5)
		app.camera.lookAt(0, 0, 0)

		const kolSayisi = uniform(4)
		const burgu = uniform(1.15)
		const boyut = uniform(4)

		const konumNode = Fn(() => {
			const i = instanceIndex
			const r = hash(i).mul(hash(i.add(5))).mul(4.2)
			const kol = floor(
				hash(i.add(3)).mul(kolSayisi)
			)
			const kolAci = kol.div(kolSayisi).mul(6.28318)
			const sapma = hash(i.add(11)).sub(0.5).mul(0.45)
			const aci = kolAci.add(r.mul(burgu)).add(sapma)
			const y = hash(i.add(19)).sub(0.5).mul(0.28)
			return vec3(
				cos(aci).mul(r),
				y,
				sin(aci).mul(r)
			)
		})

		const renkNode = Fn(() => {
			const t = hash(instanceIndex)
				.mul(hash(instanceIndex.add(5)))
				.saturate()
			return mix(
				vec3(1, 0.55, 0.22),
				vec3(0.28, 0.42, 1),
				t
			)
		})

		const malzeme = new PointsNodeMaterial({
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending
		})
		malzeme.positionNode = konumNode()
		malzeme.colorNode = renkNode()
		malzeme.sizeNode = hash(instanceIndex)
			.mul(boyut)
			.add(1.5)

		const noktalar = new Points(
			bosGeo(),
			malzeme
		) as SayiliNokta
		noktalar.count = ADET
		Object.assign(noktalar, { frustumCulled: false })
		scene.add(noktalar)

		kontrolHtml(
			kontroller,
			`<label>Kol
			<input id="kol" type="range" min="2"
			max="8" value="4" /></label>
			<label>Burgu
			<input id="burgu" type="range" min="0"
			max="30" value="12" /></label>
			<label>Boyut
			<input id="boyut" type="range" min="1"
			max="14" value="4" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#kol")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				kolSayisi.value = Number(hedef.value)
			})

		el<HTMLInputElement>(kontroller, "#burgu")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				burgu.value = Number(hedef.value) / 10
			})

		el<HTMLInputElement>(kontroller, "#boyut")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				boyut.value = Number(hedef.value)
			})

		return {
			update: () => {
				controls.update()
				istatistikEk.textContent =
					`${ADET} yıldız · spiral`
			},
			dispose: () => {
				controls.dispose()
				malzeme.dispose()
			}
		}
	}
}

import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Points,
	PointsNodeMaterial
} from "three/webgpu"
import {
	Fn,
	hash,
	instanceIndex,
	normalize,
	uniform,
	vec3,
	type TSLNode
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

const ADET = 6000

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
	id: "33",
	no: "33",
	title: "Explosion",
	bolum: "Bölüm 14 — Particles",
	akis: "normalize(rastgele) * yaş * hız → solma",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 1.8, 1.2, 3.6)
		const yas = uniform(0)
		const hiz = uniform(2.4)
		let gecen = 0

		const konumNode = Fn(() => {
			const i = instanceIndex
			const yon = normalize(
				vec3(
					hash(i).mul(2).sub(1),
					hash(i.add(1)).mul(2).sub(1),
					hash(i.add(2)).mul(2).sub(1)
				)
			)
			return yon.mul(yas).mul(hiz)
		})

		const malzeme = new PointsNodeMaterial({
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending
		})
		malzeme.positionNode = konumNode()
		malzeme.colorNode = mixRenk()
		malzeme.opacityNode = yas
			.mul(0.55)
			.oneMinus()
			.saturate()
		malzeme.sizeNode = yas
			.oneMinus()
			.mul(8)
			.add(1)

		const noktalar = new Points(
			bosGeo(),
			malzeme
		) as SayiliNokta
		noktalar.count = ADET
		Object.assign(noktalar, { frustumCulled: false })
		scene.add(noktalar)

		kontrolHtml(
			kontroller,
			`<label>Hız
			<input id="hiz" type="range" min="5"
			max="50" value="24" /></label>
			<button id="patlat" type="button" class="aktif">
			Patlat</button>`
		)

		el<HTMLInputElement>(kontroller, "#hiz")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				hiz.value = Number(hedef.value) / 10
			})

		el<HTMLButtonElement>(kontroller, "#patlat")
			?.addEventListener("click", () => {
				gecen = 0
			})

		return {
			update: (dt) => {
				controls.update()
				gecen += dt
				yas.value = Math.min(gecen, 2.4)
				istatistikEk.textContent = ky("yasSaniye", {
					n: gecen.toFixed(2)
				})
			},
			dispose: () => {
				controls.dispose()
				malzeme.dispose()
			}
		}
	}
}

function mixRenk(): TSLNode {
	return Fn(() => {
		const t = hash(instanceIndex)
		return vec3(1, t.mul(0.45).add(0.2), t.mul(0.12))
	})()
}

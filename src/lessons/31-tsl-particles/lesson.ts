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
	sin,
	time,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import notes from "./notlar.md?raw"

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
	id: "31",
	no: "31",
	title: "TSL Particles",
	bolum: "Bölüm 14 — Particles",
	akis: "instanceIndex → hash/time → positionNode",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene } = app
		const controls = kameraSifirla(app, 0, 1.2, 6)
		let adet = 5000

		const konumNode = Fn(() => {
			const i = instanceIndex
			const n1 = hash(i)
			const n2 = hash(i.add(1))
			const n3 = hash(i.add(2))
			const dalga = sin(time.add(n1.mul(6.28)))
			return vec3(
				n1.mul(6).sub(3),
				dalga.mul(0.8).add(n2.mul(2).sub(1)),
				n3.mul(6).sub(3)
			)
		})

		const renkNode = Fn(() => {
			const i = instanceIndex
			return vec3(
				hash(i),
				hash(i.add(21)).mul(0.6).add(0.3),
				hash(i.add(47))
			)
		})

		const malzeme = new PointsNodeMaterial({
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending
		})
		malzeme.positionNode = konumNode()
		malzeme.colorNode = renkNode()
		malzeme.sizeNode = hash(instanceIndex).mul(6).add(2)

		const noktalar = new Points(
			bosGeo(),
			malzeme
		) as SayiliNokta
		noktalar.count = adet
		Object.assign(noktalar, { frustumCulled: false })
		scene.add(noktalar)

		kontrolHtml(
			kontroller,
			`<label>Adet
			<input id="adet" type="range" min="400"
			max="12000" value="${adet}" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#adet")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				adet = Number(hedef.value)
				noktalar.count = adet
			})

		return {
			update: () => {
				controls.update()
				istatistikEk.textContent = ky(
					"noktaTsl",
					{ n: adet }
				)
			},
			dispose: () => {
				controls.dispose()
				malzeme.dispose()
			}
		}
	}
}

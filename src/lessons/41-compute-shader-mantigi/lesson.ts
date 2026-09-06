import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Points,
	PointsNodeMaterial
} from "three/webgpu"
import {
	compute,
	cos,
	Fn,
	hash,
	instanceIndex,
	instancedArray,
	sin,
	time,
	uniform,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import { getBackendAdi } from "@/core/webgpu-app"
import notes from "./notlar.md?raw"

const ADET = 5000

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
	id: "41",
	no: "41",
	title: "Compute Shader mantığı",
	bolum: "Bölüm 18 — Compute Shaders",
	akis: "compute yazar → instancedArray → render okur",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app, 0, 1.6, 6.2)
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		const hiz = uniform(0.55)

		const malzeme = new PointsNodeMaterial({
			transparent: true,
			depthWrite: false,
			blending: AdditiveBlending
		})
		malzeme.colorNode = vec3(
			hash(instanceIndex),
			hash(instanceIndex.add(9)).mul(0.5).add(0.4),
			1
		)
		malzeme.sizeNode = hash(instanceIndex).mul(4).add(2)

		let computeNode: ReturnType<typeof compute> | null =
			null

		if (webgpu) {
			const tampon = instancedArray(ADET, "vec3")
			const cekirdek = Fn(() => {
				const i = instanceIndex
				const tohum = hash(i)
				const aci = time
					.mul(hiz)
					.add(tohum.mul(6.28318))
				const r = tohum.mul(2.3).add(0.4)
				return tampon.element(i).assign(
					vec3(
						sin(aci).mul(r),
						tohum.mul(2).sub(1),
						cos(aci).mul(r)
					)
				)
			})()
			computeNode = compute(cekirdek, ADET)
			malzeme.positionNode = tampon.toAttribute()
		} else {
			malzeme.positionNode = Fn(() => {
				const i = instanceIndex
				const tohum = hash(i)
				return vec3(
					tohum.mul(4).sub(2),
					hash(i.add(1)).mul(2).sub(1),
					hash(i.add(2)).mul(4).sub(2)
				)
			})()
		}

		const noktalar = new Points(
			bosGeo(),
			malzeme
		) as SayiliNokta
		noktalar.count = ADET
		Object.assign(noktalar, { frustumCulled: false })
		scene.add(noktalar)

		kontrolHtml(
			kontroller,
			webgpu
				? `<label>Hız
				<input id="hiz" type="range" min="1"
				max="20" value="6" /></label>
				<p>${ky("computeYaziyor")}</p>`
				: `<p>${ky("computeIsterBackend", {
					ad: getBackendAdi(renderer)
				})}</p>`
		)

		el<HTMLInputElement>(kontroller, "#hiz")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				hiz.value = Number(hedef.value) / 10
			})

		return {
			update: () => {
				controls.update()
				if (computeNode !== null) {
					renderer.compute(computeNode)
				}
				istatistikEk.textContent = webgpu
					? ky("noktaCompute", { n: ADET })
					: ky("computeYokWebgl")
			},
			dispose: () => {
				controls.dispose()
				malzeme.dispose()
			}
		}
	}
}

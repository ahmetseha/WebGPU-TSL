import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	PointsNodeMaterial
} from "three/webgpu"
import {
	compute,
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
import { getBackendAdi } from "@/core/webgpu-app"
import notes from "./notlar.md?raw"

const ADET = 12000

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
	id: "42",
	no: "42",
	title: "WebGPU Compute",
	bolum: "Bölüm 18 — Compute Shaders",
	akis: "CPU komut → Compute → Storage buffer → Points",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer, canvas } = app
		const controls = kameraSifirla(app, 0, 0.4, 4.2)
		scene.background = new Color("#0b0d12")
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		const genlik = uniform(0.55)
		const konumlar = instancedArray(ADET, "vec3")

		const baslatDugumu = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const i = instanceIndex.add(1)
			return p.assign(
				vec3(
					hash(i).mul(4).sub(2),
					hash(i.add(3)).mul(2).sub(1),
					hash(i.add(7)).mul(4).sub(2)
				)
			)
		})()

		const guncelleDugumu = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const i = instanceIndex.add(11)
			return p.addAssign(
				vec3(
					0,
					sin(time.add(hash(i))).mul(0.006).mul(genlik),
					0
				)
			)
		})()

		const baslatCompute = compute(baslatDugumu, ADET)
		const guncelleCompute = compute(guncelleDugumu, ADET)

		const malzeme = new PointsNodeMaterial()
		malzeme.colorNode = vec3(0.55, 0.85, 1)
		malzeme.transparent = true
		malzeme.depthWrite = false
		malzeme.blending = AdditiveBlending

		const cpuDizi = new Float32Array(ADET * 3)
		const cpuGeo = new BufferGeometry()
		cpuGeo.setAttribute(
			"position",
			new BufferAttribute(cpuDizi, 3)
		)

		let noktalar: Points
		if (webgpu) {
			malzeme.positionNode = konumlar.toAttribute()
			const gpuNokta = new Points(
				bosGeo(),
				malzeme
			) as SayiliNokta
			gpuNokta.count = ADET
			noktalar = gpuNokta
			renderer.compute(baslatCompute)
		} else {
			for (let i = 0; i < ADET; i += 1) {
				cpuDizi[i * 3] = (hashSayi(i) - 0.5) * 4
				cpuDizi[i * 3 + 1] = (hashSayi(i + 3) - 0.5) * 2
				cpuDizi[i * 3 + 2] = (hashSayi(i + 7) - 0.5) * 4
			}
			cpuGeo.attributes["position"]!.needsUpdate = true
			noktalar = new Points(cpuGeo, malzeme)
		}

		Object.assign(noktalar, { frustumCulled: false })
		scene.add(noktalar)
		istatistikEk.textContent = webgpu
			? `${ADET} nokta · compute`
			: "compute yok · CPU yedek"

		kontrolHtml(
			kontroller,
			`${webgpu ? "" : "<p>Compute WebGPU ister. WebGL — CPU yedek.</p>"}
			<label>Genlik
			<input id="genlik" type="range" min="1"
			max="20" value="8" /></label>
			<button id="sifirla" type="button">Sıfırla</button>`
		)

		el<HTMLInputElement>(kontroller, "#genlik")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				genlik.value = Number(hedef.value) / 10
			})

		el<HTMLButtonElement>(kontroller, "#sifirla")
			?.addEventListener("click", () => {
				if (webgpu) {
					renderer.compute(baslatCompute)
					return
				}
				for (let i = 0; i < ADET; i += 1) {
					cpuDizi[i * 3] = (hashSayi(i) - 0.5) * 4
					cpuDizi[i * 3 + 1] =
						(hashSayi(i + 3) - 0.5) * 2
					cpuDizi[i * 3 + 2] =
						(hashSayi(i + 7) - 0.5) * 4
				}
				cpuGeo.attributes["position"]!.needsUpdate = true
			})

		let zaman = 0

		return {
			update: (dt) => {
				controls.update()
				zaman += dt
				if (webgpu) {
					renderer.compute(guncelleCompute)
					return
				}
				const g = Number(genlik.value)
				for (let i = 0; i < ADET; i += 1) {
					const y0 = (hashSayi(i + 3) - 0.5) * 2
					cpuDizi[i * 3 + 1] =
						y0 + Math.sin(zaman + i * 0.01) * 0.2 * g
				}
				cpuGeo.attributes["position"]!.needsUpdate = true
			},
			dispose: () => {
				controls.dispose()
				canvas.blur()
			}
		}
	}
}

function hashSayi(n: number): number {
	const x = Math.sin(n * 127.1) * 43758.5453
	return x - Math.floor(x)
}

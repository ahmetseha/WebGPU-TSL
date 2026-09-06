import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	PointsNodeMaterial,
	Sprite
} from "three/webgpu"
import {
	compute,
	float,
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

type SayiliSprite = Sprite & { count: number }

type CpuTane = {
	x: number
	y: number
	z: number
	vx: number
	vy: number
	vz: number
}

export const lesson: LessonModule = {
	id: "43",
	no: "43",
	title: "GPU parçacık simülasyonu",
	bolum: "Bölüm 18 — Compute Shaders",
	akis: "Init → velocity + position → Sprite / Points",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer } = app
		const controls = kameraSifirla(app, 0, 1.2, 5)
		scene.background = new Color("#0c1018")
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		let adet = 4000
		const surt = uniform(0.992)

		let temizlik = (): void => {}
		let kare = (_dt: number): void => {}

		const kur = (sayi: number): void => {
			temizlik()
			adet = sayi
			if (webgpu) {
				const paket = gpuKur(renderer, sayi, surt)
				scene.add(paket.nesne)
				kare = () => {
					renderer.compute(paket.guncelle)
				}
				temizlik = () => {
					scene.remove(paket.nesne)
					paket.malzeme.dispose()
				}
				return
			}
			const paket = cpuKur(sayi)
			scene.add(paket.nesne)
			kare = (dt) => {
				cpuAdim(paket.taneler, paket.dizi, dt)
				paket.geo.attributes["position"]!.needsUpdate =
					true
			}
			temizlik = () => {
				scene.remove(paket.nesne)
				paket.geo.dispose()
				paket.malzeme.dispose()
			}
		}

		kur(adet)
		istatistikEk.textContent = webgpu
			? ky("konumHizCompute")
			: ky("computeYokYedek")

		kontrolHtml(
			kontroller,
			`${webgpu ? "" : "<p>Compute WebGPU ister. WebGL — CPU yedek.</p>"}
			<label>Adet
			<input id="adet" type="range" min="500"
			max="8000" step="500" value="4000" /></label>
			<label>Sürtünme
			<input id="surt" type="range" min="90"
			max="99" value="99" /></label>`
		)

		el<HTMLInputElement>(kontroller, "#adet")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				kur(Number(hedef.value))
			})

		el<HTMLInputElement>(kontroller, "#surt")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) {
					return
				}
				surt.value = Number(hedef.value) / 100
			})

		return {
			update: (dt) => {
				controls.update()
				kare(dt)
			},
			dispose: () => {
				temizlik()
				controls.dispose()
			}
		}
	}
}

function gpuKur(
	renderer: {
		compute: (node: unknown) => void
	},
	adet: number,
	surt: ReturnType<typeof uniform>
): {
	nesne: Sprite
	malzeme: PointsNodeMaterial
	guncelle: ReturnType<typeof compute>
} {
	const konumlar = instancedArray(adet, "vec3")
	const hizlar = instancedArray(adet, "vec3")

	const baslat = Fn(() => {
		const p = konumlar.element(instanceIndex)
		const v = hizlar.element(instanceIndex)
		const i = instanceIndex.add(1)
		p.assign(
			vec3(
				hash(i).mul(4).sub(2),
				hash(i.add(2)).mul(3).sub(0.5),
				hash(i.add(4)).mul(4).sub(2)
			)
		)
		return v.assign(
			vec3(
				hash(i.add(6)).sub(0.5).mul(0.02),
				hash(i.add(8)).sub(0.5).mul(0.01),
				hash(i.add(10)).sub(0.5).mul(0.02)
			)
		)
	})()

	const guncelleDugumu = Fn(() => {
		const p = konumlar.element(instanceIndex)
		const v = hizlar.element(instanceIndex)
		const i = instanceIndex.add(13)
		v.addAssign(
			vec3(0, sin(time.add(hash(i))).mul(0.0004), 0)
		)
		v.mulAssign(surt)
		return p.addAssign(v)
	})()

	const guncelle = compute(guncelleDugumu, adet)
	renderer.compute(compute(baslat, adet))

	const malzeme = new PointsNodeMaterial()
	malzeme.positionNode = konumlar.toAttribute()
	malzeme.colorNode = vec3(0.7, 0.9, 1)
	malzeme.sizeNode = float(0.045)
	malzeme.transparent = true
	malzeme.depthWrite = false
	malzeme.blending = AdditiveBlending

	const sprite = new Sprite(malzeme) as SayiliSprite
	sprite.count = adet
	return {
		nesne: sprite,
		malzeme,
		guncelle
	}
}

function cpuKur(adet: number): {
	nesne: Points
	geo: BufferGeometry
	malzeme: PointsNodeMaterial
	dizi: Float32Array
	taneler: CpuTane[]
} {
	const taneler: CpuTane[] = []
	const dizi = new Float32Array(adet * 3)
	for (let i = 0; i < adet; i += 1) {
		const tane: CpuTane = {
			x: (hashSayi(i) - 0.5) * 4,
			y: hashSayi(i + 2) * 3,
			z: (hashSayi(i + 4) - 0.5) * 4,
			vx: (hashSayi(i + 6) - 0.5) * 0.02,
			vy: (hashSayi(i + 8) - 0.5) * 0.01,
			vz: (hashSayi(i + 10) - 0.5) * 0.02
		}
		taneler.push(tane)
		dizi[i * 3] = tane.x
		dizi[i * 3 + 1] = tane.y
		dizi[i * 3 + 2] = tane.z
	}
	const geo = new BufferGeometry()
	geo.setAttribute(
		"position",
		new BufferAttribute(dizi, 3)
	)
	const malzeme = new PointsNodeMaterial({
		color: "#b8e6ff",
		size: 0.05
	})
	malzeme.transparent = true
	malzeme.depthWrite = false
	malzeme.blending = AdditiveBlending
	return {
		nesne: new Points(geo, malzeme),
		geo,
		malzeme,
		dizi,
		taneler
	}
}

function cpuAdim(
	taneler: CpuTane[],
	dizi: Float32Array,
	dt: number
): void {
	const s = 0.99
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		t.vy += Math.sin(dt * 60 + i) * 0.0004
		t.vx *= s
		t.vy *= s
		t.vz *= s
		t.x += t.vx
		t.y += t.vy
		t.z += t.vz
		dizi[i * 3] = t.x
		dizi[i * 3 + 1] = t.y
		dizi[i * 3 + 2] = t.z
	}
}

function hashSayi(n: number): number {
	const x = Math.sin(n * 127.1) * 43758.5453
	return x - Math.floor(x)
}

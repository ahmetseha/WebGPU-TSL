import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Fog,
	Mesh,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	Points,
	PointsNodeMaterial,
	Sprite,
	SpriteNodeMaterial,
	Vector3
} from "three/webgpu"
import {
	compute,
	float,
	Fn,
	hash,
	instanceIndex,
	instancedArray,
	length,
	mix,
	normalize,
	sin,
	step,
	time,
	uniform,
	vec3
} from "three/tsl"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla, temelIsik } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import { getBackendAdi } from "@/core/webgpu-app"
import notes from "./notlar.md?raw"

const ADET = 3500

type SayiliSprite = Sprite & { count: number }

type KarTane = {
	x: number
	y: number
	z: number
	vx: number
	vy: number
	vz: number
}

export const lesson: LessonModule = {
	id: "47",
	no: "47",
	title: "Kar",
	bolum: "Bölüm 22 — Snow",
	akis: "doğum → düşüş + rüzgar → kamera kaçın → döngü",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer, camera, canvas } = app
		const controls = kameraSifirla(app, 3.2, 1.8, 5.2)
		scene.background = new Color("#1b2230")
		scene.fog = new Fog("#1b2230", 8, 22)
		temelIsik(scene)
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		const ruzgar = uniform(0.55)
		const kameraVec = new Vector3()
		const kameraU = uniform(kameraVec)

		const zemin = new Mesh(
			new PlaneGeometry(18, 18),
			new MeshStandardNodeMaterial({
				color: "#d7e3ef",
				roughness: 1
			})
		)
		zemin.rotation.x = -Math.PI / 2
		scene.add(zemin)
		istatistikEk.textContent = webgpu
			? ky("karCompute")
			: ky("computeYokKar")

		let kare = (): void => {}
		let temizlik = (): void => {}

		if (webgpu) {
			const konumlar = instancedArray(ADET, "vec3")
			const hizlar = instancedArray(ADET, "vec3")

			const baslat = Fn(() => {
				const p = konumlar.element(instanceIndex)
				const v = hizlar.element(instanceIndex)
				const i = instanceIndex.add(1)
				p.assign(
					vec3(
						hash(i).mul(16).sub(8),
						hash(i.add(2)).mul(8).add(0.4),
						hash(i.add(4)).mul(16).sub(8)
					)
				)
				return v.assign(
					vec3(
						hash(i.add(6)).sub(0.5).mul(0.008),
						hash(i.add(8)).mul(-0.018).sub(0.01),
						hash(i.add(10)).sub(0.5).mul(0.008)
					)
				)
			})()

			const guncelleDugumu = Fn(() => {
				const p = konumlar.element(instanceIndex)
				const v = hizlar.element(instanceIndex)
				const i = instanceIndex.add(21)
				p.addAssign(v)
				p.addAssign(
					vec3(
						ruzgar.mul(0.01),
						0,
						sin(time.add(hash(i))).mul(0.004)
					)
				)
				const fark = p.sub(kameraU)
				const kacin = step(length(fark), float(1.35))
				p.addAssign(normalize(fark).mul(kacin).mul(0.05))
				const dustu = step(p.y, float(0.06))
				const dogum = vec3(
					hash(i.add(time)).mul(16).sub(8),
					hash(i.add(3)).mul(3).add(6),
					hash(i.add(5)).mul(16).sub(8)
				)
				return p.assign(mix(p, dogum, dustu))
			})()

			const guncelle = compute(guncelleDugumu, ADET)
			renderer.compute(compute(baslat, ADET))

			const malzeme = new SpriteNodeMaterial()
			malzeme.positionNode = konumlar.toAttribute()
			malzeme.colorNode = vec3(0.92, 0.96, 1)
			malzeme.scaleNode = float(0.055).mul(
				hash(instanceIndex).mul(0.7).add(0.55)
			)
			malzeme.rotationNode = time.mul(
				hash(instanceIndex.add(2)).sub(0.5).mul(1.6)
			)
			malzeme.transparent = true
			malzeme.depthWrite = false
			malzeme.opacity = 0.85
			const sprite = new Sprite(malzeme) as SayiliSprite
			sprite.count = ADET
			scene.add(sprite)
			kare = () => {
				kameraVec.set(
					camera.position.x,
					camera.position.y,
					camera.position.z
				)
				renderer.compute(guncelle)
			}
			temizlik = () => {
				scene.remove(sprite)
				malzeme.dispose()
			}
		} else {
			const paket = cpuKur(ADET)
			scene.add(paket.nesne)
			kare = () => {
				cpuAdim(
					paket.taneler,
					paket.dizi,
					Number(ruzgar.value),
					camera.position
				)
				paket.geo.attributes["position"]!.needsUpdate =
					true
			}
			temizlik = () => {
				scene.remove(paket.nesne)
				paket.geo.dispose()
				paket.malzeme.dispose()
			}
		}

		kontrolHtml(
			kontroller,
			`${webgpu ? "" : `<p>${ky("computeIsterYedek")}</p>`}
			<label>Rüzgar
			<input id="ruzgar" type="range" min="0"
			max="20" value="6" /></label>
			<p>${ky("karSavrulur")}</p>`
		)

		el<HTMLInputElement>(kontroller, "#ruzgar")
			?.addEventListener("input", (event) => {
				const h = event.target
				if (!(h instanceof HTMLInputElement)) {
					return
				}
				ruzgar.value = Number(h.value) / 10
			})

		return {
			update: () => {
				controls.update()
				kare()
			},
			dispose: () => {
				temizlik()
				controls.dispose()
				canvas.blur()
			}
		}
	}
}

function cpuKur(adet: number): {
	nesne: Points
	geo: BufferGeometry
	malzeme: PointsNodeMaterial
	dizi: Float32Array
	taneler: KarTane[]
} {
	const taneler: KarTane[] = []
	const dizi = new Float32Array(adet * 3)
	for (let i = 0; i < adet; i += 1) {
		const tane: KarTane = {
			x: (hashSayi(i) - 0.5) * 16,
			y: hashSayi(i + 2) * 8 + 0.4,
			z: (hashSayi(i + 4) - 0.5) * 16,
			vx: (hashSayi(i + 6) - 0.5) * 0.008,
			vy: hashSayi(i + 8) * -0.018 - 0.01,
			vz: (hashSayi(i + 10) - 0.5) * 0.008
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
		color: "#eef6ff",
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
	taneler: KarTane[],
	dizi: Float32Array,
	ruzgar: number,
	kamera: Vector3
): void {
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		t.x += t.vx + ruzgar * 0.01
		t.y += t.vy
		t.z += t.vz + Math.sin(t.y + i) * 0.004
		const dx = t.x - kamera.x
		const dy = t.y - kamera.y
		const dz = t.z - kamera.z
		const uzak = Math.hypot(dx, dy, dz) + 0.001
		if (uzak < 1.35) {
			t.x += (dx / uzak) * 0.05
			t.y += (dy / uzak) * 0.05
			t.z += (dz / uzak) * 0.05
		}
		if (t.y < 0.06) {
			t.y = 6 + hashSayi(i + 3) * 3
			t.x = (hashSayi(i + 21) - 0.5) * 16
			t.z = (hashSayi(i + 25) - 0.5) * 16
		}
		dizi[i * 3] = t.x
		dizi[i * 3 + 1] = t.y
		dizi[i * 3 + 2] = t.z
	}
}

function hashSayi(n: number): number {
	const x = Math.sin(n * 127.1) * 43758.5453
	return x - Math.floor(x)
}

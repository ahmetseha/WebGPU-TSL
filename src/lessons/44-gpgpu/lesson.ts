import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Mesh,
	MeshBasicNodeMaterial,
	Points,
	PointsNodeMaterial,
	SphereGeometry,
	Sprite,
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
	step,
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

const ADET = 5000

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
	id: "44",
	no: "44",
	title: "GPGPU",
	bolum: "Bölüm 19 — GPGPU",
	akis: "p, v, a tamponları → kuvvet → Euler → çizim",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer, canvas } = app
		const controls = kameraSifirla(app, 0, 1.4, 5.2)
		scene.background = new Color("#0a0c12")
		temelIsik(scene)
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		const hedefVec = new Vector3(0, 1, 0)
		const hedef = uniform(hedefVec)
		const cekme = uniform(0.0012)

		const cekirdek = new Mesh(
			new SphereGeometry(0.12, 16, 16),
			new MeshBasicNodeMaterial({ color: "#ffe08a" })
		)
		cekirdek.position.set(0, 1, 0)
		scene.add(cekirdek)
		istatistikEk.textContent = webgpu
			? ky("pvaGpgpu")
			: ky("computeYokYedek")

		let kare = (_dt: number): void => {}
		let temizlik = (): void => {}

		if (webgpu) {
			const konumlar = instancedArray(ADET, "vec3")
			const hizlar = instancedArray(ADET, "vec3")
			const ivmeler = instancedArray(ADET, "vec3")

			const baslat = Fn(() => {
				const p = konumlar.element(instanceIndex)
				const v = hizlar.element(instanceIndex)
				const a = ivmeler.element(instanceIndex)
				const i = instanceIndex.add(1)
				p.assign(
					vec3(
						hash(i).mul(6).sub(3),
						hash(i.add(2)).mul(4),
						hash(i.add(4)).mul(6).sub(3)
					)
				)
				v.assign(vec3(0, 0, 0))
				return a.assign(vec3(0, 0, 0))
			})()

			const guncelleDugumu = Fn(() => {
				const p = konumlar.element(instanceIndex)
				const v = hizlar.element(instanceIndex)
				const a = ivmeler.element(instanceIndex)
				const yon = hedef.sub(p)
				const uzak = length(yon).add(0.08)
				a.assign(normalize(yon).mul(cekme).div(uzak))
				v.addAssign(a)
				v.mulAssign(0.985)
				p.addAssign(v)
				const dustu = step(p.y, float(-0.2))
				return p.assign(
					mix(p, vec3(p.x, float(0.05), p.z), dustu)
				)
			})()

			const guncelle = compute(guncelleDugumu, ADET)
			renderer.compute(compute(baslat, ADET))

			const malzeme = new PointsNodeMaterial()
			malzeme.positionNode = konumlar.toAttribute()
			malzeme.colorNode = vec3(0.45, 0.75, 1)
			malzeme.sizeNode = float(0.04)
			malzeme.transparent = true
			malzeme.depthWrite = false
			malzeme.blending = AdditiveBlending
			const sprite = new Sprite(malzeme) as SayiliSprite
			sprite.count = ADET
			scene.add(sprite)
			kare = () => {
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
				cpuAdim(paket.taneler, paket.dizi, hedefVec)
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
			<label>Çekim
			<input id="cekme" type="range" min="2"
			max="40" value="12" /></label>
			<p>${ky("sariHedef")}</p>`
		)

		el<HTMLInputElement>(kontroller, "#cekme")
			?.addEventListener("input", (event) => {
				const hedefEl = event.target
				if (!(hedefEl instanceof HTMLInputElement)) {
					return
				}
				cekme.value = Number(hedefEl.value) / 10000
			})

		const fare = (event: PointerEvent): void => {
			const r = canvas.getBoundingClientRect()
			hedefVec.set(
				((event.clientX - r.left) / r.width - 0.5) * 6,
				(0.5 - (event.clientY - r.top) / r.height) * 4 +
					0.6,
				0
			)
			cekirdek.position.set(
				hedefVec.x,
				hedefVec.y,
				hedefVec.z
			)
		}
		canvas.addEventListener("pointermove", fare)

		return {
			update: (dt) => {
				controls.update()
				kare(dt)
			},
			dispose: () => {
				canvas.removeEventListener("pointermove", fare)
				temizlik()
				controls.dispose()
			}
		}
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
			x: (hashSayi(i) - 0.5) * 6,
			y: hashSayi(i + 2) * 4,
			z: (hashSayi(i + 4) - 0.5) * 6,
			vx: 0,
			vy: 0,
			vz: 0
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
		color: "#7ec8ff",
		size: 0.045
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
	hedef: Vector3
): void {
	const guc = 0.0012
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		const dx = hedef.x - t.x
		const dy = hedef.y - t.y
		const dz = hedef.z - t.z
		const uzak = Math.hypot(dx, dy, dz) + 0.08
		const ax = (dx / uzak) * guc
		const ay = (dy / uzak) * guc
		const az = (dz / uzak) * guc
		t.vx = (t.vx + ax) * 0.985
		t.vy = (t.vy + ay) * 0.985
		t.vz = (t.vz + az) * 0.985
		t.x += t.vx
		t.y += t.vy
		t.z += t.vz
		if (t.y < -0.2) {
			t.y = 0.05
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

import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Points,
	PointsNodeMaterial,
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
import { kameraSifirla } from "@/core/sahne"
import { ky } from "@/i18n/kontrol"
import { getBackendAdi } from "@/core/webgpu-app"
import notes from "./notlar.md?raw"

const ADET = 4500

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
	id: "45",
	no: "45",
	title: "Parçacık fiziği",
	bolum: "Bölüm 20 — Particle physics",
	akis: "yerçekimi + sürtünme + çekim/itme + Euler",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer, canvas } = app
		const controls = kameraSifirla(app, 0, 1.6, 5.4)
		scene.background = new Color("#0b0e14")
		const webgpu = getBackendAdi(renderer) === "WebGPU"

		const fareVec = new Vector3(0, 1, 0)
		const fare = uniform(fareVec)
		const yercekimi = uniform(-0.0014)
		const surtunme = uniform(0.985)
		const fareGuc = uniform(0.0024)
		const itme = uniform(0)
		istatistikEk.textContent = webgpu
			? ky("yerFareCompute")
			: ky("computeYokYedek")

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
						hash(i).mul(5).sub(2.5),
						hash(i.add(2)).mul(3).add(0.4),
						hash(i.add(4)).mul(5).sub(2.5)
					)
				)
				return v.assign(vec3(0, 0, 0))
			})()

			const guncelleDugumu = Fn(() => {
				const p = konumlar.element(instanceIndex)
				const v = hizlar.element(instanceIndex)
				v.addAssign(vec3(0, yercekimi, 0))
				const fark = fare.sub(p)
				const uzak = length(fark).add(0.12)
				const yon = normalize(fark).mul(fareGuc).div(uzak)
				const isaret = mix(float(1), float(-1), itme)
				v.addAssign(yon.mul(isaret))
				v.mulAssign(surtunme)
				p.addAssign(v)
				const dustu = step(p.y, float(0.04))
				p.assign(mix(p, vec3(p.x, float(0.04), p.z), dustu))
				return v.assign(
					mix(v, vec3(v.x, v.y.mul(-0.35), v.z), dustu)
				)
			})()

			const guncelle = compute(guncelleDugumu, ADET)
			renderer.compute(compute(baslat, ADET))
			const malzeme = new PointsNodeMaterial()
			malzeme.positionNode = konumlar.toAttribute()
			malzeme.colorNode = mix(
				vec3(0.4, 0.8, 1),
				vec3(1, 0.7, 0.4),
				hash(instanceIndex.add(9))
			)
			malzeme.sizeNode = float(0.042)
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
				cpuAdim(
					paket.taneler,
					paket.dizi,
					fareVec,
					Number(yercekimi.value),
					Number(surtunme.value),
					Number(fareGuc.value),
					Number(itme.value) > 0.5
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
			<label>Yerçekimi
			<input id="yer" type="range" min="0"
			max="40" value="14" /></label>
			<label>Sürtünme
			<input id="surt" type="range" min="90"
			max="99" value="98" /></label>
			<label>Fare gücü
			<input id="guc" type="range" min="0"
			max="50" value="24" /></label>
			<button id="cek" type="button" class="aktif">Çekim</button>
			<button id="it" type="button">İtme</button>`
		)

		el<HTMLInputElement>(kontroller, "#yer")
			?.addEventListener("input", (event) => {
				const h = event.target
				if (!(h instanceof HTMLInputElement)) return
				yercekimi.value = Number(h.value) * -0.0001
			})
		el<HTMLInputElement>(kontroller, "#surt")
			?.addEventListener("input", (event) => {
				const h = event.target
				if (!(h instanceof HTMLInputElement)) return
				surtunme.value = Number(h.value) / 100
			})
		el<HTMLInputElement>(kontroller, "#guc")
			?.addEventListener("input", (event) => {
				const h = event.target
				if (!(h instanceof HTMLInputElement)) return
				fareGuc.value = Number(h.value) / 10000
			})

		const cekBtn = el<HTMLButtonElement>(kontroller, "#cek")
		const itBtn = el<HTMLButtonElement>(kontroller, "#it")
		cekBtn?.addEventListener("click", () => {
			itme.value = 0
			cekBtn.classList.add("aktif")
			itBtn?.classList.remove("aktif")
		})
		itBtn?.addEventListener("click", () => {
			itme.value = 1
			itBtn.classList.add("aktif")
			cekBtn?.classList.remove("aktif")
		})

		const fareYaz = (event: PointerEvent): void => {
			const r = canvas.getBoundingClientRect()
			fareVec.set(
				((event.clientX - r.left) / r.width - 0.5) * 6,
				(0.5 - (event.clientY - r.top) / r.height) * 3.4 +
					0.8,
				0
			)
		}
		canvas.addEventListener("pointermove", fareYaz)

		return {
			update: () => {
				controls.update()
				kare()
			},
			dispose: () => {
				canvas.removeEventListener("pointermove", fareYaz)
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
			x: (hashSayi(i) - 0.5) * 5,
			y: hashSayi(i + 2) * 3 + 0.4,
			z: (hashSayi(i + 4) - 0.5) * 5,
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
		color: "#9ad4ff",
		size: 0.04
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
	fare: Vector3,
	yer: number,
	surt: number,
	guc: number,
	itiyor: boolean
): void {
	const isaret = itiyor ? -1 : 1
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		t.vy += yer
		const dx = fare.x - t.x
		const dy = fare.y - t.y
		const dz = fare.z - t.z
		const uzak = Math.hypot(dx, dy, dz) + 0.12
		t.vx += (dx / uzak) * guc * isaret
		t.vy += (dy / uzak) * guc * isaret
		t.vz += (dz / uzak) * guc * isaret
		t.vx *= surt
		t.vy *= surt
		t.vz *= surt
		t.x += t.vx
		t.y += t.vy
		t.z += t.vz
		if (t.y < 0.04) {
			t.y = 0.04
			t.vy *= -0.35
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

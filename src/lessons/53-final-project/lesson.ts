import {
	AdditiveBlending,
	BoxGeometry,
	BufferAttribute,
	BufferGeometry,
	Color,
	CylinderGeometry,
	Euler,
	Fog,
	HemisphereLight,
	IcosahedronGeometry,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshBasicNodeMaterial,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	PointLight,
	Points,
	PointsNodeMaterial,
	Quaternion,
	RenderPipeline,
	SphereGeometry,
	Sprite,
	SpriteNodeMaterial,
	Vector3
} from "three/webgpu"
import { bloom } from "three/addons/tsl/display/BloomNode.js"
import {
	abs,
	cameraPosition,
	compute,
	cos,
	dot,
	float,
	Fn,
	hash,
	instanceIndex,
	instancedArray,
	length,
	mix,
	mx_noise_float,
	normalize,
	normalWorld,
	pass,
	positionLocal,
	positionWorld,
	sin,
	step,
	time,
	uniform,
	uv,
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

const CAM = 50
const KAYA = 32
const KAR = 2600
const DUMAN = 140

type SayiliSprite = Sprite & { count: number }

type Tane = {
	x: number
	y: number
	z: number
	vx: number
	vy: number
	vz: number
}

export const lesson: LessonModule = {
	id: "53",
	no: "53",
	title: "Bitirme projesi",
	bolum: "Bölüm 28 — Final project",
	akis: "arazi + instance + compute kar/duman + fresnel + bloom",
	notes,
	start({ app, kontroller, istatistikEk }) {
		const { scene, renderer, camera, canvas } = app
		const controls = kameraSifirla(app, 9.2, 4.2, 11.4)
		controls.target.set(0, 0.8, 0)
		scene.background = new Color("#1a1e2c")
		scene.fog = new Fog("#1c2230", 12, 34)
		temelIsik(scene)
		scene.add(
			new HemisphereLight("#6a7a9a", "#1c1814", 0.45)
		)
		const webgpu = getBackendAdi(renderer) === "WebGPU"
		istatistikEk.textContent = webgpu
			? ky("kampGpu")
			: ky("kampCpu")
		const ruzgar = uniform(0.45)
		const kameraVec = new Vector3()
		const kameraU = uniform(kameraVec)
		const bacaVec = new Vector3(0.48, 2.05, -0.2)
		const bacaU = uniform(bacaVec)

		const araziMat = new MeshStandardNodeMaterial({
			color: "#d5e2ec",
			roughness: 0.92
		})
		araziMat.positionNode = positionLocal.add(
			vec3(0, 0, araziYNode())
		)
		araziMat.colorNode = mix(
			vec3(0.72, 0.8, 0.86),
			vec3(0.38, 0.46, 0.4),
			mx_noise_float(
				vec3(positionWorld.x, positionWorld.z, 0).mul(0.18)
			).mul(0.35).add(0.35)
		)
		const arazi = new Mesh(
			new PlaneGeometry(28, 28, 72, 72),
			araziMat
		)
		arazi.rotation.x = -Math.PI / 2
		scene.add(arazi)

		const camMat = new MeshStandardNodeMaterial({
			color: "#1b3324",
			roughness: 0.88
		})
		const govdeMat = new MeshStandardNodeMaterial({
			color: "#3a2a20",
			roughness: 1
		})
		const camlar = new InstancedMesh(
			new CylinderGeometry(0, 0.48, 1.45, 6),
			camMat,
			CAM
		)
		const govdeler = new InstancedMesh(
			new CylinderGeometry(0.07, 0.1, 0.55, 5),
			govdeMat,
			CAM
		)
		dizCam(camlar, govdeler)
		scene.add(camlar, govdeler)

		const kayaMat = new MeshStandardNodeMaterial({
			color: "#6b6762",
			roughness: 0.95
		})
		kayaMat.colorNode = mix(
			vec3(0.32, 0.3, 0.28),
			vec3(0.5, 0.48, 0.44),
			hash(instanceIndex)
		)
		const kayalar = new InstancedMesh(
			new IcosahedronGeometry(0.2, 0),
			kayaMat,
			KAYA
		)
		dizKaya(kayalar)
		scene.add(kayalar)

		kabinKur(scene)

		const lamba = new PointLight("#ff9a4a", 2.1, 11)
		lamba.position.set(0.42, 0.92, 0.78)
		scene.add(lamba)

		const kalkanMat = new MeshBasicNodeMaterial()
		const bakis = normalize(
			cameraPosition.sub(positionWorld)
		)
		const fresnel = abs(dot(normalWorld, bakis)).oneMinus()
		kalkanMat.colorNode = mix(
			vec3(0.08, 0.18, 0.26),
			vec3(0.55, 0.85, 1),
			fresnel
		)
		kalkanMat.opacityNode = fresnel.mul(0.72).add(0.14)
		kalkanMat.transparent = true
		kalkanMat.depthWrite = false
		const kalkan = new Mesh(
			new SphereGeometry(0.55, 28, 28),
			kalkanMat
		)
		kalkan.position.set(2.1, 1.15, 1.35)
		scene.add(kalkan)

		const karPaket = karKur(
			renderer,
			webgpu,
			ruzgar,
			kameraU
		)
		scene.add(karPaket.nesne)

		const dumanPaket = dumanKur(renderer, webgpu, bacaU)
		scene.add(dumanPaket.nesne)

		const sahneGecis = pass(scene, camera)
		const pipeline = new RenderPipeline(renderer)
		let bloomAcik = true
		const cikisKur = (): void => {
			const renk = sahneGecis.getTextureNode()
			const uvn = uv().sub(0.5)
			const vig = length(uvn).mul(1.28).saturate()
			const karart = mix(1, 0.3, vig)
			if (bloomAcik) {
				pipeline.outputNode = renk
					.add(bloom(renk, 0.38, 0.28, 0.74))
					.mul(karart)
			} else {
				pipeline.outputNode = renk.mul(karart)
			}
			pipeline.needsUpdate = true
		}
		cikisKur()

		kontrolHtml(
			kontroller,
			`${webgpu ? "" : `<p>${ky("computeIsterKamp")}</p>`}
			<label>Rüzgar
			<input id="ruzgar" type="range" min="0"
			max="18" value="5" /></label>
			<button id="bloom" type="button" class="aktif">Bloom</button>
			<p>${ky("kampNot")}</p>`
		)

		el<HTMLInputElement>(kontroller, "#ruzgar")
			?.addEventListener("input", (event) => {
				const h = event.target
				if (!(h instanceof HTMLInputElement)) {
					return
				}
				ruzgar.value = Number(h.value) / 10
			})

		const bloomBtn = el<HTMLButtonElement>(
			kontroller,
			"#bloom"
		)
		bloomBtn?.addEventListener("click", () => {
			bloomAcik = !bloomAcik
			bloomBtn.classList.toggle("aktif", bloomAcik)
			cikisKur()
		})

		let zaman = 0

		return {
			render: () => {
				pipeline.render()
			},
			update: (dt) => {
				controls.update()
				zaman += dt
				lamba.intensity = 1.7 + Math.sin(zaman * 3.2) * 0.4
				kalkan.position.y = 1.15 + Math.sin(zaman) * 0.08
				kameraVec.set(
					camera.position.x,
					camera.position.y,
					camera.position.z
				)
				if (webgpu) {
					karPaket.gpu?.()
					dumanPaket.gpu?.()
					return
				}
				karPaket.cpu?.(dt)
				dumanPaket.cpu?.(dt)
			},
			dispose: () => {
				pipeline.dispose()
				karPaket.temizlik()
				dumanPaket.temizlik()
				controls.dispose()
				canvas.blur()
			}
		}
	}
}

function araziY(x: number, z: number): number {
	return Math.sin(x * 0.28) * Math.cos(z * 0.24) * 1.05
}

function araziYNode() {
	return sin(positionLocal.x.mul(0.28))
		.mul(cos(positionLocal.y.mul(0.24)))
		.mul(1.05)
}

function dizCam(
	camlar: InstancedMesh,
	govdeler: InstancedMesh
): void {
	const matris = new Matrix4()
	const pos = new Vector3()
	const euler = new Euler()
	const quat = new Quaternion()
	const olcek = new Vector3()
	let i = 0
	let deneme = 0
	while (i < CAM && deneme < 400) {
		deneme += 1
		const x = (hashSayi(deneme + 3) - 0.5) * 22
		const z = (hashSayi(deneme + 9) - 0.5) * 22
		if (Math.hypot(x, z) < 3.2) {
			continue
		}
		const y = araziY(x, z)
		const s = 0.75 + hashSayi(deneme) * 0.7
		euler.set(0, hashSayi(deneme + 1) * 6.2, 0)
		quat.setFromEuler(euler)
		olcek.set(s, s, s)
		pos.set(x, y + 0.95 * s, z)
		matris.compose(pos, quat, olcek)
		camlar.setMatrixAt(i, matris)
		pos.set(x, y + 0.28 * s, z)
		olcek.set(s, s, s)
		matris.compose(pos, quat, olcek)
		govdeler.setMatrixAt(i, matris)
		i += 1
	}
}

function dizKaya(mesh: InstancedMesh): void {
	const matris = new Matrix4()
	const pos = new Vector3()
	const euler = new Euler()
	const quat = new Quaternion()
	const olcek = new Vector3()
	for (let i = 0; i < KAYA; i += 1) {
		const x = (hashSayi(i + 80) - 0.5) * 20
		const z = (hashSayi(i + 99) - 0.5) * 20
		pos.set(x, araziY(x, z) + 0.06, z)
		euler.set(
			hashSayi(i) * 0.8,
			hashSayi(i + 2) * 5,
			hashSayi(i + 4) * 0.5
		)
		quat.setFromEuler(euler)
		const s = 0.6 + hashSayi(i + 6) * 1.5
		olcek.set(s, s * 0.65, s)
		matris.compose(pos, quat, olcek)
		mesh.setMatrixAt(i, matris)
	}
}

function kabinKur(scene: {
	add: (...n: Mesh[]) => unknown
}): void {
	const govde = new Mesh(
		new BoxGeometry(1.6, 1.1, 1.25),
		new MeshStandardNodeMaterial({
			color: "#4a3428",
			roughness: 0.92
		})
	)
	govde.position.set(0, 0.55, 0)
	const cati = new Mesh(
		new BoxGeometry(1.9, 0.18, 1.5),
		new MeshStandardNodeMaterial({
			color: "#2b241f",
			roughness: 0.85
		})
	)
	cati.position.set(0, 1.18, 0)
	cati.rotation.z = 0.08
	const baca = new Mesh(
		new BoxGeometry(0.22, 0.55, 0.22),
		new MeshStandardNodeMaterial({
			color: "#3a322c",
			roughness: 1
		})
	)
	baca.position.set(0.48, 1.55, -0.2)
	const pencereMat = new MeshStandardNodeMaterial({
		color: "#ffb060",
		roughness: 0.3
	})
	pencereMat.emissiveNode = vec3(1.3, 0.55, 0.16)
	const pencere = new Mesh(
		new BoxGeometry(0.28, 0.28, 0.04),
		pencereMat
	)
	pencere.position.set(0.35, 0.72, 0.64)
	scene.add(govde, cati, baca, pencere)
}

function karKur(
	renderer: { compute: (n: unknown) => void },
	webgpu: boolean,
	ruzgar: ReturnType<typeof uniform>,
	kameraU: ReturnType<typeof uniform>
): {
	nesne: Sprite | Points
	gpu?: () => void
	cpu?: (dt: number) => void
	temizlik: () => void
} {
	if (webgpu) {
		const konumlar = instancedArray(KAR, "vec3")
		const hizlar = instancedArray(KAR, "vec3")
		const baslat = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const v = hizlar.element(instanceIndex)
			const i = instanceIndex.add(1)
			p.assign(
				vec3(
					hash(i).mul(22).sub(11),
					hash(i.add(2)).mul(9).add(0.5),
					hash(i.add(4)).mul(22).sub(11)
				)
			)
			return v.assign(
				vec3(
					hash(i.add(6)).sub(0.5).mul(0.006),
					hash(i.add(8)).mul(-0.016).sub(0.008),
					hash(i.add(10)).sub(0.5).mul(0.006)
				)
			)
		})()
		const guncelleDugumu = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const v = hizlar.element(instanceIndex)
			const i = instanceIndex.add(17)
			p.addAssign(v)
			p.addAssign(
				vec3(
					ruzgar.mul(0.01),
					0,
					sin(time.add(hash(i))).mul(0.003)
				)
			)
			const fark = p.sub(kameraU)
			const kacin = step(length(fark), float(1.5))
			p.addAssign(normalize(fark).mul(kacin).mul(0.04))
			const dustu = step(p.y, float(0.08))
			return p.assign(
				mix(
					p,
					vec3(
						hash(i.add(time)).mul(22).sub(11),
						hash(i.add(3)).mul(3).add(7),
						hash(i.add(5)).mul(22).sub(11)
					),
					dustu
				)
			)
		})()
		const guncelle = compute(guncelleDugumu, KAR)
		renderer.compute(compute(baslat, KAR))
		const malzeme = new SpriteNodeMaterial()
		malzeme.positionNode = konumlar.toAttribute()
		malzeme.colorNode = vec3(0.9, 0.94, 1)
		malzeme.scaleNode = float(0.05).mul(
			hash(instanceIndex).mul(0.65).add(0.55)
		)
		malzeme.rotationNode = time.mul(
			hash(instanceIndex.add(2)).sub(0.5)
		)
		malzeme.transparent = true
		malzeme.depthWrite = false
		malzeme.opacity = 0.82
		const sprite = new Sprite(malzeme) as SayiliSprite
		sprite.count = KAR
		return {
			nesne: sprite,
			gpu: () => {
				renderer.compute(guncelle)
			},
			temizlik: () => {
				malzeme.dispose()
			}
		}
	}
	const paket = cpuTaneler(KAR, 22, 9, -0.02)
	return {
		nesne: paket.nesne,
		cpu: () => {
			cpuKar(
				paket.taneler,
				paket.dizi,
				Number(ruzgar.value)
			)
			paket.geo.attributes["position"]!.needsUpdate = true
		},
		temizlik: () => {
			paket.geo.dispose()
			paket.malzeme.dispose()
		}
	}
}

function dumanKur(
	renderer: { compute: (n: unknown) => void },
	webgpu: boolean,
	bacaU: ReturnType<typeof uniform>
): {
	nesne: Sprite | Points
	gpu?: () => void
	cpu?: (dt: number) => void
	temizlik: () => void
} {
	if (webgpu) {
		const konumlar = instancedArray(DUMAN, "vec3")
		const baslat = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const i = instanceIndex.add(3)
			return p.assign(
				bacaU.add(
					vec3(
						hash(i).sub(0.5).mul(0.18),
						hash(i.add(2)).mul(0.3),
						hash(i.add(4)).sub(0.5).mul(0.18)
					)
				)
			)
		})()
		const guncelleDugumu = Fn(() => {
			const p = konumlar.element(instanceIndex)
			const i = instanceIndex.add(8)
			p.addAssign(
				vec3(
					sin(time.add(hash(i))).mul(0.004),
					0.012,
					cos(time.add(hash(i.add(1)))).mul(0.004)
				)
			)
			const yuksek = step(bacaU.y.add(2.3), p.y)
			return p.assign(
				mix(
					p,
					bacaU.add(
						vec3(
							hash(i.add(time)).sub(0.5).mul(0.16),
							hash(i.add(2)).mul(0.2),
							hash(i.add(4)).sub(0.5).mul(0.16)
						)
					),
					yuksek
				)
			)
		})()
		const guncelle = compute(guncelleDugumu, DUMAN)
		renderer.compute(compute(baslat, DUMAN))
		const malzeme = new SpriteNodeMaterial()
		malzeme.positionNode = konumlar.toAttribute()
		malzeme.colorNode = vec3(0.55, 0.58, 0.62)
		malzeme.scaleNode = float(0.11)
		malzeme.transparent = true
		malzeme.depthWrite = false
		malzeme.opacity = 0.35
		const sprite = new Sprite(malzeme) as SayiliSprite
		sprite.count = DUMAN
		return {
			nesne: sprite,
			gpu: () => {
				renderer.compute(guncelle)
			},
			temizlik: () => {
				malzeme.dispose()
			}
		}
	}
	const paket = cpuTaneler(DUMAN, 0.3, 1.2, 0.02)
	return {
		nesne: paket.nesne,
		cpu: () => {
			cpuDuman(paket.taneler, paket.dizi)
			paket.geo.attributes["position"]!.needsUpdate = true
		},
		temizlik: () => {
			paket.geo.dispose()
			paket.malzeme.dispose()
		}
	}
}

function cpuTaneler(
	adet: number,
	yayilim: number,
	yuk: number,
	vy: number
): {
	nesne: Points
	geo: BufferGeometry
	malzeme: PointsNodeMaterial
	dizi: Float32Array
	taneler: Tane[]
} {
	const taneler: Tane[] = []
	const dizi = new Float32Array(adet * 3)
	for (let i = 0; i < adet; i += 1) {
		const tane: Tane = {
			x: (hashSayi(i) - 0.5) * yayilim,
			y: hashSayi(i + 2) * yuk + 0.4,
			z: (hashSayi(i + 4) - 0.5) * yayilim,
			vx: (hashSayi(i + 6) - 0.5) * 0.006,
			vy,
			vz: (hashSayi(i + 8) - 0.5) * 0.006
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
		color: "#e8eef4",
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

function cpuKar(
	taneler: Tane[],
	dizi: Float32Array,
	ruzgar: number
): void {
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		t.x += t.vx + ruzgar * 0.01
		t.y += t.vy
		t.z += t.vz
		if (t.y < 0.08) {
			t.y = 8
			t.x = (hashSayi(i + 11) - 0.5) * 22
			t.z = (hashSayi(i + 13) - 0.5) * 22
		}
		dizi[i * 3] = t.x
		dizi[i * 3 + 1] = t.y
		dizi[i * 3 + 2] = t.z
	}
}

function cpuDuman(taneler: Tane[], dizi: Float32Array): void {
	for (let i = 0; i < taneler.length; i += 1) {
		const t = taneler[i]
		if (t === undefined) {
			continue
		}
		t.y += 0.012
		t.x += Math.sin(t.y + i) * 0.003
		if (t.y > 3.2) {
			t.y = 1.7
			t.x = 0.48 + (hashSayi(i) - 0.5) * 0.16
			t.z = -0.2 + (hashSayi(i + 2) - 0.5) * 0.16
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

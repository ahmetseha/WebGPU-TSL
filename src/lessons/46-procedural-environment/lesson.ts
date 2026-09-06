import {
	Color,
	CylinderGeometry,
	DoubleSide,
	Euler,
	Fog,
	HemisphereLight,
	IcosahedronGeometry,
	InstancedMesh,
	Matrix4,
	Mesh,
	MeshStandardNodeMaterial,
	PlaneGeometry,
	Quaternion,
	Vector3
} from "three/webgpu"
import {
	cos,
	hash,
	instanceIndex,
	mix,
	mx_noise_float,
	positionLocal,
	positionWorld,
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
import { kameraSifirla, temelIsik } from "@/core/sahne"
import notes from "./notlar.md?raw"

const CIME = 520
const KAYA = 48

export const lesson: LessonModule = {
	id: "46",
	no: "46",
	title: "Prosedürel ortam",
	bolum: "Bölüm 21 — Procedural environment",
	akis: "arazi vertex → instance çimen/kaya → rüzgar → sis",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app, 7.2, 3.4, 8.4)
		controls.target.set(0, 0.4, 0)
		scene.background = new Color("#87a0b4")
		scene.fog = new Fog("#9aafb8", 10, 28)
		temelIsik(scene)
		scene.add(new HemisphereLight("#c9d8e8", "#3d4a32", 0.55))

		const ruzgar = uniform(0.7)
		const araziMat = new MeshStandardNodeMaterial({
			color: "#4d6a3c",
			roughness: 0.95
		})
		araziMat.positionNode = positionLocal.add(
			vec3(0, 0, araziYNode())
		)
		araziMat.colorNode = mix(
			vec3(0.22, 0.32, 0.16),
			vec3(0.42, 0.48, 0.28),
			mx_noise_float(
				vec3(positionWorld.x, positionWorld.z, 0).mul(0.2)
			).mul(0.5).add(0.5)
		)
		const arazi = new Mesh(
			new PlaneGeometry(22, 22, 70, 70),
			araziMat
		)
		arazi.rotation.x = -Math.PI / 2
		scene.add(arazi)

		const cimenGeo = new PlaneGeometry(0.07, 0.4)
		const cimenMat = new MeshStandardNodeMaterial({
			color: "#3f6d32",
			roughness: 1
		})
		cimenMat.side = DoubleSide
		cimenMat.positionNode = positionLocal.add(
			vec3(
				sin(
					time.mul(1.7).add(positionWorld.x.mul(2.2))
				).mul(ruzgar).mul(0.16).mul(
					positionLocal.y.add(0.2)
				),
				0,
				0
			)
		)
		cimenMat.colorNode = mix(
			vec3(0.18, 0.34, 0.12),
			vec3(0.4, 0.55, 0.2),
			hash(instanceIndex)
		)
		const cimen = new InstancedMesh(
			cimenGeo,
			cimenMat,
			CIME
		)
		dizCimen(cimen)
		scene.add(cimen)

		const kayaGeo = new IcosahedronGeometry(0.22, 0)
		const kayaMat = new MeshStandardNodeMaterial({
			color: "#6a6560",
			roughness: 0.9
		})
		kayaMat.colorNode = mix(
			vec3(0.28, 0.27, 0.25),
			vec3(0.45, 0.42, 0.38),
			hash(instanceIndex)
		)
		const kayalar = new InstancedMesh(
			kayaGeo,
			kayaMat,
			KAYA
		)
		dizKaya(kayalar)
		scene.add(kayalar)

		const govde = new Mesh(
			new CylinderGeometry(0.08, 0.12, 0.7, 5),
			new MeshStandardNodeMaterial({
				color: "#4a3426",
				roughness: 1
			})
		)
		govde.position.set(1.2, araziY(1.2, -0.8) + 0.35, -0.8)
		const yaprak = new Mesh(
			new CylinderGeometry(0, 0.55, 1.3, 6),
			new MeshStandardNodeMaterial({
				color: "#2d4a28",
				roughness: 0.85
			})
		)
		yaprak.position.set(1.2, araziY(1.2, -0.8) + 1.15, -0.8)
		scene.add(govde, yaprak)

		kontrolHtml(
			kontroller,
			`<label>Rüzgar
			<input id="ruzgar" type="range" min="0"
			max="20" value="7" /></label>
			<p>Tek tepe, çimen, kaya. Efekt çöplüğü değil.</p>`
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
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

function araziY(x: number, z: number): number {
	return Math.sin(x * 0.32) * Math.cos(z * 0.26) * 0.85
}

function araziYNode() {
	return sin(positionLocal.x.mul(0.32))
		.mul(cos(positionLocal.y.mul(0.26)))
		.mul(0.85)
}

function dizCimen(mesh: InstancedMesh): void {
	const matris = new Matrix4()
	const pos = new Vector3()
	const euler = new Euler()
	const quat = new Quaternion()
	const olcek = new Vector3()
	for (let i = 0; i < CIME; i += 1) {
		const x = (hashSayi(i) - 0.5) * 18
		const z = (hashSayi(i + 17) - 0.5) * 18
		pos.set(x, araziY(x, z) + 0.2, z)
		euler.set(0, hashSayi(i + 3) * Math.PI * 2, 0)
		quat.setFromEuler(euler)
		const s = 0.75 + hashSayi(i + 5) * 0.7
		olcek.set(s, s, s)
		matris.compose(pos, quat, olcek)
		mesh.setMatrixAt(i, matris)
	}
}

function dizKaya(mesh: InstancedMesh): void {
	const matris = new Matrix4()
	const pos = new Vector3()
	const euler = new Euler()
	const quat = new Quaternion()
	const olcek = new Vector3()
	for (let i = 0; i < KAYA; i += 1) {
		const x = (hashSayi(i + 40) - 0.5) * 16
		const z = (hashSayi(i + 61) - 0.5) * 16
		pos.set(x, araziY(x, z) + 0.08, z)
		euler.set(
			hashSayi(i) * 0.6,
			hashSayi(i + 2) * 6,
			hashSayi(i + 4) * 0.4
		)
		quat.setFromEuler(euler)
		const s = 0.5 + hashSayi(i + 8) * 1.4
		olcek.set(s, s * 0.7, s)
		matris.compose(pos, quat, olcek)
		mesh.setMatrixAt(i, matris)
	}
}

function hashSayi(n: number): number {
	const x = Math.sin(n * 127.1) * 43758.5453
	return x - Math.floor(x)
}

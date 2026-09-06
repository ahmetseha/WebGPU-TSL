import {
	BoxGeometry,
	LineBasicMaterial,
	LineSegments,
	Mesh,
	MeshBasicNodeMaterial,
	Points,
	PointsMaterial,
	WireframeGeometry,
	type BufferGeometry
} from "three/webgpu"
import {
	el,
	kontrolHtml,
	type LessonModule
} from "@/core/lesson"
import { kameraSifirla } from "@/core/sahne"
import notes from "./notlar.md?raw"

function kup(segment: number): Mesh {
	return new Mesh(
		new BoxGeometry(1, 1, 1, segment, segment, segment),
		new MeshBasicNodeMaterial({ color: "#3ec5f1" })
	)
}

function telKafes(geometry: BufferGeometry): LineSegments {
	return new LineSegments(
		new WireframeGeometry(geometry),
		new LineBasicMaterial({ color: "#f4f7fb" })
	)
}

export const lesson: LessonModule = {
	id: "01",
	no: "01",
	title: "GPU nasıl çalışır?",
	bolum: "Bölüm 1 — GPU ve WebGPU temelleri",
	akis: "CPU → Draw Call → Vertex → Triangle → Fragment → Framebuffer",
	notes,
	start({ app, kontroller }) {
		const { scene } = app
		const controls = kameraSifirla(app)
		let segment = 1
		let ana = kup(segment)
		let tel = telKafes(ana.geometry)
		const nokta = new Points(
			ana.geometry,
			new PointsMaterial({
				color: "#ffcc33",
				size: 0.08
			})
		)
		const ekstra: Mesh[] = []
		scene.add(ana, tel, nokta)

		kontrolHtml(
			kontroller,
			`<label>Segment <input id="segment" type="range" min="1" max="12" value="1" /></label>
			<button id="tel" type="button" class="aktif">Tel kafes</button>
			<button id="nokta" type="button" class="aktif">Vertexler</button>
			<button id="ekle" type="button">Mesh ekle</button>
			<button id="sil" type="button">Mesh sil</button>`
		)

		el<HTMLInputElement>(kontroller, "#segment")
			?.addEventListener("input", (event) => {
				const hedef = event.target
				if (!(hedef instanceof HTMLInputElement)) return
				segment = Number(hedef.value)
				scene.remove(ana, tel)
				ana.geometry.dispose()
				tel.geometry.dispose()
				ana = kup(segment)
				tel = telKafes(ana.geometry)
				nokta.geometry = ana.geometry
				scene.add(ana, tel)
			})

		el<HTMLButtonElement>(kontroller, "#tel")
			?.addEventListener("click", (event) => {
				tel.visible = !tel.visible
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.toggle(
						"aktif",
						tel.visible
					)
			})

		el<HTMLButtonElement>(kontroller, "#nokta")
			?.addEventListener("click", (event) => {
				nokta.visible = !nokta.visible
				event.currentTarget instanceof HTMLElement &&
					event.currentTarget.classList.toggle(
						"aktif",
						nokta.visible
					)
			})

		el<HTMLButtonElement>(kontroller, "#ekle")
			?.addEventListener("click", () => {
				const kopya = kup(segment)
				kopya.position.set((ekstra.length + 1) * 1.4, 0, 0)
				ekstra.push(kopya)
				scene.add(kopya)
			})

		el<HTMLButtonElement>(kontroller, "#sil")
			?.addEventListener("click", () => {
				const son = ekstra.pop()
				if (son === undefined) return
				scene.remove(son)
				son.geometry.dispose()
				son.material.dispose()
			})

		return {
			update: () => {
				controls.update()
				ana.rotation.y += 0.004
				tel.rotation.y = ana.rotation.y
				nokta.rotation.y = ana.rotation.y
			},
			dispose: () => {
				controls.dispose()
			}
		}
	}
}

type Nokta = { x: number; y: number; z: number }

const PHI = (1 + Math.sqrt(5)) / 2
const PALET = " .:-=+*#%@"
const AKIS = [
	"CPU",
	"DRAW",
	"VERTEX",
	"TRIANGLE",
	"FRAGMENT"
] as const

const hamKose: Nokta[] = [
	{ x: -1, y: PHI, z: 0 },
	{ x: 1, y: PHI, z: 0 },
	{ x: -1, y: -PHI, z: 0 },
	{ x: 1, y: -PHI, z: 0 },
	{ x: 0, y: -1, z: PHI },
	{ x: 0, y: 1, z: PHI },
	{ x: 0, y: -1, z: -PHI },
	{ x: 0, y: 1, z: -PHI },
	{ x: PHI, y: 0, z: -1 },
	{ x: PHI, y: 0, z: 1 },
	{ x: -PHI, y: 0, z: -1 },
	{ x: -PHI, y: 0, z: 1 }
]

const koseler: Nokta[] = hamKose.map((n) => {
	const u = Math.hypot(n.x, n.y, n.z)
	return { x: n.x / u, y: n.y / u, z: n.z / u }
})

const yuzler: readonly [number, number, number][] = [
	[0, 11, 5],
	[0, 5, 1],
	[0, 1, 7],
	[0, 7, 10],
	[0, 10, 11],
	[1, 5, 9],
	[5, 11, 4],
	[11, 10, 2],
	[10, 7, 6],
	[7, 1, 8],
	[3, 9, 4],
	[3, 4, 2],
	[3, 2, 6],
	[3, 6, 8],
	[3, 8, 9],
	[4, 9, 5],
	[2, 4, 11],
	[6, 2, 10],
	[8, 6, 7],
	[9, 8, 1]
]

const isik: Nokta = birim({ x: -0.35, y: 0.72, z: 0.58 })

let kareId = 0
let calisiyor = false
let gozlemci: ResizeObserver | null = null
let genislik = 0
let yukseklik = 0

const darEkran = (): boolean =>
	window.matchMedia("(max-width: 900px)").matches

const azalsin = (): boolean =>
	window.matchMedia("(prefers-reduced-motion: reduce)")
		.matches

function birim(n: Nokta): Nokta {
	const u = Math.hypot(n.x, n.y, n.z) || 1
	return { x: n.x / u, y: n.y / u, z: n.z / u }
}

function cevir(n: Nokta, ax: number, ay: number): Nokta {
	const cy = Math.cos(ay)
	const sy = Math.sin(ay)
	const y1 = {
		x: n.x * cy + n.z * sy,
		y: n.y,
		z: n.z * cy - n.x * sy
	}
	const cx = Math.cos(ax)
	const sx = Math.sin(ax)
	return {
		x: y1.x,
		y: y1.y * cx - y1.z * sx,
		z: y1.y * sx + y1.z * cx
	}
}

function carp(a: Nokta, b: Nokta): Nokta {
	return {
		x: a.y * b.z - a.z * b.y,
		y: a.z * b.x - a.x * b.z,
		z: a.x * b.y - a.y * b.x
	}
}

function koseAl(i: number): Nokta {
	return koseler[i] ?? { x: 0, y: 0, z: 0 }
}

function tuvalAl(): HTMLCanvasElement | null {
	const el = document.getElementById("karsilama-tuval")
	return el instanceof HTMLCanvasElement ? el : null
}

function boyutAyarla(tuval: HTMLCanvasElement): void {
	const kutu = tuval.parentElement
	if (kutu === null) {
		return
	}

	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	const w = Math.max(1, Math.floor(kutu.clientWidth))
	const h = Math.max(1, Math.floor(kutu.clientHeight))
	if (w === genislik && h === yukseklik) {
		return
	}

	genislik = w
	yukseklik = h
	tuval.width = Math.floor(w * dpr)
	tuval.height = Math.floor(h * dpr)
	tuval.style.width = `${w}px`
	tuval.style.height = `${h}px`
	const ctx = tuval.getContext("2d")
	ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function akisiYaz(zaman: number): void {
	const sira = Math.floor(zaman / 900) % AKIS.length
	document
		.querySelectorAll(".karsilama-gorsel-alt span")
		.forEach((el, i) => {
			el.classList.toggle("aktif", i === sira)
		})
}

function ciz(
	ctx: CanvasRenderingContext2D,
	zaman: number
): void {
	const w = genislik
	const h = yukseklik
	if (w < 8 || h < 8) {
		return
	}

	const hucre = Math.max(9, Math.min(13, Math.floor(w / 52)))
	const sutun = Math.floor(w / hucre)
	const satir = Math.floor(h / hucre)
	if (sutun < 8 || satir < 8) {
		return
	}

	const derinlik = new Float32Array(sutun * satir)
	const isiklar = new Float32Array(sutun * satir)
	const kenar = new Uint8Array(sutun * satir)
	derinlik.fill(-999)

	const ax = 0.42 + Math.sin(zaman * 0.00035) * 0.12
	const ay = zaman * 0.00055
	const olcek = Math.min(sutun, satir) * 0.36
	const ortaX = (sutun - 1) / 2
	const ortaY = (satir - 1) / 2 + 0.2

	const izdusum = koseler.map((n) => {
		const r = cevir(n, ax, ay)
		return {
			x: ortaX + r.x * olcek,
			y: ortaY - r.y * olcek,
			z: r.z
		}
	})

	for (const yuz of yuzler) {
		const a = izdusum[yuz[0]]
		const b = izdusum[yuz[1]]
		const c = izdusum[yuz[2]]
		if (a === undefined || b === undefined || c === undefined) {
			continue
		}

		const ka = cevir(koseAl(yuz[0]), ax, ay)
		const kb = cevir(koseAl(yuz[1]), ax, ay)
		const kc = cevir(koseAl(yuz[2]), ax, ay)
		const normal = birim(
			carp(
				{ x: kb.x - ka.x, y: kb.y - ka.y, z: kb.z - ka.z },
				{ x: kc.x - ka.x, y: kc.y - ka.y, z: kc.z - ka.z }
			)
		)
		if (normal.z <= 0.02) {
			continue
		}

		const ton = Math.max(
			0,
			normal.x * isik.x +
				normal.y * isik.y +
				normal.z * isik.z
		)
		const zOrt = (a.z + b.z + c.z) / 3
		ucgenDoldur(
			sutun,
			satir,
			a,
			b,
			c,
			zOrt,
			0.18 + ton * 0.82,
			derinlik,
			isiklar
		)
		kenarCiz(sutun, satir, a, b, derinlik, kenar)
		kenarCiz(sutun, satir, b, c, derinlik, kenar)
		kenarCiz(sutun, satir, c, a, derinlik, kenar)
	}

	ctx.clearRect(0, 0, w, h)
	ctx.font = `600 ${hucre}px "JetBrains Mono", ui-monospace, monospace`
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"

	for (let y = 0; y < satir; y += 1) {
		for (let x = 0; x < sutun; x += 1) {
			const i = y * sutun + x
			const d = derinlik[i] ?? -999
			if (d < -100) {
				continue
			}

			const parlak = isiklar[i] ?? 0
			const idx = Math.min(
				PALET.length - 1,
				Math.floor(parlak * (PALET.length - 1))
			)
			const harf = PALET[idx] ?? "+"
			if (kenar[i] === 1) {
				ctx.fillStyle = parlak > 0.62
					? "#34d399"
					: "#ff6b35"
			} else if (parlak > 0.78) {
				ctx.fillStyle = "#f3efe9"
			} else if (parlak > 0.45) {
				ctx.fillStyle = "#ff8a5c"
			} else {
				ctx.fillStyle = "rgba(255, 107, 53, 0.42)"
			}

			ctx.fillText(
				harf,
				(x + 0.5) * hucre,
				(y + 0.5) * hucre
			)
		}
	}
}

function ucgenDoldur(
	sutun: number,
	satir: number,
	a: Nokta,
	b: Nokta,
	c: Nokta,
	z: number,
	ton: number,
	derinlik: Float32Array,
	isiklar: Float32Array
): void {
	const minX = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x)))
	const maxX = Math.min(sutun - 1, Math.ceil(Math.max(a.x, b.x, c.x)))
	const minY = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y)))
	const maxY = Math.min(satir - 1, Math.ceil(Math.max(a.y, b.y, c.y)))
	const alan = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
	if (Math.abs(alan) < 0.0001) {
		return
	}

	for (let y = minY; y <= maxY; y += 1) {
		for (let x = minX; x <= maxX; x += 1) {
			const w0 = (b.x - x) * (c.y - y) - (b.y - y) * (c.x - x)
			const w1 = (c.x - x) * (a.y - y) - (c.y - y) * (a.x - x)
			const w2 = (a.x - x) * (b.y - y) - (a.y - y) * (b.x - x)
			if (w0 * alan < 0 || w1 * alan < 0 || w2 * alan < 0) {
				continue
			}

			const i = y * sutun + x
			const once = derinlik[i] ?? -999
			if (z >= once) {
				derinlik[i] = z
				isiklar[i] = ton
			}
		}
	}
}

function kenarCiz(
	sutun: number,
	satir: number,
	a: Nokta,
	b: Nokta,
	derinlik: Float32Array,
	kenar: Uint8Array
): void {
	let x0 = Math.round(a.x)
	let y0 = Math.round(a.y)
	const x1 = Math.round(b.x)
	const y1 = Math.round(b.y)
	const dx = Math.abs(x1 - x0)
	const dy = Math.abs(y1 - y0)
	const sx = x0 < x1 ? 1 : -1
	const sy = y0 < y1 ? 1 : -1
	let hata = dx - dy
	const z = Math.max(a.z, b.z) + 0.02

	while (true) {
		if (x0 >= 0 && y0 >= 0 && x0 < sutun && y0 < satir) {
			const i = y0 * sutun + x0
			const once = derinlik[i] ?? -999
			if (z >= once - 0.08) {
				kenar[i] = 1
			}
		}
		if (x0 === x1 && y0 === y1) {
			break
		}
		const e2 = 2 * hata
		if (e2 > -dy) {
			hata -= dy
			x0 += sx
		}
		if (e2 < dx) {
			hata += dx
			y0 += sy
		}
	}
}

function kare(zaman: number): void {
	if (!calisiyor) {
		return
	}

	const tuval = tuvalAl()
	const ctx = tuval === null ? null : tuval.getContext("2d")
	if (tuval !== null && ctx !== null) {
		boyutAyarla(tuval)
		ciz(ctx, zaman)
		akisiYaz(zaman)
	}

	if (azalsin()) {
		return
	}

	kareId = requestAnimationFrame(kare)
}

function gorunurMu(): boolean {
	const panel = document.getElementById("karsilama")
	return (
		panel !== null &&
		!panel.hasAttribute("hidden") &&
		!darEkran() &&
		document.visibilityState === "visible"
	)
}

function donguyuKur(): void {
	if (calisiyor || !gorunurMu()) {
		return
	}

	calisiyor = true
	if (azalsin()) {
		kare(1200)
		return
	}

	kareId = requestAnimationFrame(kare)
}

function donguyuKes(): void {
	calisiyor = false
	cancelAnimationFrame(kareId)
}

const gorunurluk = (): void => {
	if (gorunurMu()) {
		donguyuKur()
		return
	}
	donguyuKes()
}

export function karsilamaSahneyiBaslat(): void {
	const tuval = tuvalAl()
	if (tuval === null) {
		return
	}

	const kutu = tuval.parentElement
	if (kutu === null) {
		return
	}

	karsilamaSahneyiDurdur()
	genislik = 0
	yukseklik = 0
	gozlemci = new ResizeObserver(() => {
		genislik = 0
		if (gorunurMu()) {
			donguyuKur()
			return
		}
		donguyuKes()
	})
	gozlemci.observe(kutu)
	window.addEventListener("resize", gorunurluk)
	document.addEventListener("visibilitychange", gorunurluk)
	donguyuKur()
}

export function karsilamaSahneyiDurdur(): void {
	donguyuKes()
	gozlemci?.disconnect()
	gozlemci = null
	window.removeEventListener("resize", gorunurluk)
	document.removeEventListener("visibilitychange", gorunurluk)
}

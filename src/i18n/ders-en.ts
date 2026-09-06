export type DersCeviri = {
	title: string
	bolum: string
	akis?: string
}

export const dersEn: Record<string, DersCeviri> = {
	"01": {
		title: "How does a GPU work?",
		bolum: "Part 1 — GPU and WebGPU basics"
	},
	"02": {
		title: "WebGL and WebGPU",
		bolum: "Part 1 — GPU and WebGPU basics"
	},
	"03": {
		title: "WebGPURenderer",
		bolum: "Part 1 — GPU and WebGPU basics"
	},
	"04": {
		title: "What is a shader?",
		bolum: "Part 2 — Shader thinking"
	},
	"05": {
		title: "Coordinate systems",
		bolum: "Part 2 — Shader thinking"
	},
	"06": {
		title: "What is TSL?",
		bolum: "Part 3 — TSL basics"
	},
	"07": {
		title: "TSL data types",
		bolum: "Part 3 — TSL basics"
	},
	"08": {
		title: "TSL operations",
		bolum: "Part 3 — TSL basics"
	},
	"09": {
		title: "Swizzling",
		bolum: "Part 3 — TSL basics"
	},
	"10": {
		title: "Uniforms",
		bolum: "Part 3 — TSL basics"
	},
	"11": {
		title: "Variables (toVar)",
		bolum: "Part 3 — TSL basics"
	},
	"12": {
		title: "Fn",
		bolum: "Part 3 — TSL basics"
	},
	"13": {
		title: "What are UVs?",
		bolum: "Part 4 — UVs and patterns"
	},
	"14": {
		title: "UV manipulation",
		bolum: "Part 4 — UVs and patterns",
		akis: "uv * scale + offset + rot + time scroll"
	},
	"15": {
		title: "Procedural patterns",
		bolum: "Part 4 — UVs and patterns"
	},
	"16": {
		title: "Texture sampling",
		bolum: "Part 6 — Textures"
	},
	"17": {
		title: "Texture distortion",
		bolum: "Part 6 — Textures"
	},
	"18": {
		title: "How noise works",
		bolum: "Part 7 — Noise"
	},
	"19": {
		title: "Procedural noise",
		bolum: "Part 7 — Noise",
		akis: "noise → terrain / cloud / smoke / dissolve"
	},
	"20": {
		title: "Position nodes",
		bolum: "Part 8 — Vertex manipulation"
	},
	"21": {
		title: "Vertex displacement",
		bolum: "Part 8 — Vertex manipulation",
		akis: "positionLocal + sin / noise + time → wave / flag / terrain / jelly"
	},
	"22": {
		title: "Normals",
		bolum: "Part 8 — Vertex manipulation",
		akis: "displace vertex → old broken normal / approximate normal"
	},
	"23": {
		title: "Node materials",
		bolum: "Part 9 — Materials"
	},
	"24": {
		title: "Material nodes",
		bolum: "Part 9 — Materials"
	},
	"25": {
		title: "Fresnel",
		bolum: "Part 10 — Fresnel"
	},
	"26": {
		title: "Time",
		bolum: "Part 11 — Procedural animation",
		akis: "time * speed → sin → scale / color / position"
	},
	"27": {
		title: "Animated noise",
		bolum: "Part 11 — Procedural animation",
		akis: "noise(uv + time) → smoke / water / energy / lava"
	},
	"28": {
		title: "Coffee smoke",
		bolum: "Part 12 — Coffee smoke",
		akis: "cup + rim + plane: noise + UV scroll + alpha mask"
	},
	"29": {
		title: "Hologram shield",
		bolum: "Part 13 — Hologram / shield"
	},
	"30": {
		title: "Particle systems",
		bolum: "Part 14 — Particles"
	},
	"31": {
		title: "TSL particles",
		bolum: "Part 14 — Particles"
	},
	"32": {
		title: "Galaxy",
		bolum: "Part 14 — Particles",
		akis: "radius → arm angle + twist → spiral"
	},
	"33": {
		title: "Explosion",
		bolum: "Part 14 — Particles",
		akis: "normalize(random) * age * speed → fade"
	},
	"34": {
		title: "InstancedMesh",
		bolum: "Part 15 — Instancing"
	},
	"35": {
		title: "TSL + instances",
		bolum: "Part 15 — Instancing"
	},
	"36": {
		title: "Post-processing logic",
		bolum: "Part 16 — Post-processing"
	},
	"37": {
		title: "TSL post-processing",
		bolum: "Part 16 — Post-processing"
	},
	"38": {
		title: "Bloom",
		bolum: "Part 16 — Post-processing",
		akis: "HDR / emissive → threshold → blur → add back"
	},
	"39": {
		title: "Depth buffer",
		bolum: "Part 17 — Depth"
	},
	"40": {
		title: "Depth effects",
		bolum: "Part 17 — Depth",
		akis: "depth → fog / color / coarse focus"
	},
	"41": {
		title: "Compute shader logic",
		bolum: "Part 18 — Compute shaders"
	},
	"42": {
		title: "WebGPU compute",
		bolum: "Part 18 — Compute shaders",
		akis: "CPU command → Compute → Storage buffer → Points"
	},
	"43": {
		title: "GPU particle simulation",
		bolum: "Part 18 — Compute shaders"
	},
	"44": {
		title: "GPGPU",
		bolum: "Part 19 — GPGPU",
		akis: "p, v, a buffers → force → Euler → draw"
	},
	"45": {
		title: "Particle physics",
		bolum: "Part 20 — Particle physics",
		akis: "gravity + friction + attract/repel + Euler"
	},
	"46": {
		title: "Procedural environment",
		bolum: "Part 21 — Procedural environment",
		akis: "terrain vertex → grass/rock instances → wind → fog"
	},
	"47": {
		title: "Snow",
		bolum: "Part 22 — Snow",
		akis: "spawn → fall + wind → camera avoid → loop"
	},
	"48": {
		title: "Performance",
		bolum: "Part 23 — Performance",
		akis: "draw call × triangles × shader × memory → frame time"
	},
	"49": {
		title: "Three.js debug",
		bolum: "Part 24 — Three.js debug"
	},
	"50": {
		title: "Chrome DevTools",
		bolum: "Part 25 — Chrome DevTools"
	},
	"51": {
		title: "WebGPU debug tools",
		bolum: "Part 26 — WebGPU debug tools"
	},
	"52": {
		title: "GPU errors",
		bolum: "Part 27 — GPU errors",
		akis: "validation → Console.warn · do not crash the tab"
	},
	"53": {
		title: "Final project",
		bolum: "Part 28 — Final project",
		akis: "terrain + instance + compute snow/smoke + fresnel + bloom"
	}
}

export function dersBaslik(
	id: string,
	yedek: string
): string {
	return dersEn[id]?.title ?? yedek
}

export function dersBolum(
	id: string,
	yedek: string
): string {
	return dersEn[id]?.bolum ?? yedek
}

export function dersAkis(
	id: string,
	yedek: string
): string {
	return dersEn[id]?.akis ?? yedek
}

declare module "three/webgpu" {
	export class Color {
		r: number
		g: number
		b: number
		constructor(color?: string | number)
		set(color: string | number): this
	}

	export class Vector2 {
		x: number
		y: number
		constructor(x?: number, y?: number)
		set(x: number, y: number): this
	}

	export class Vector3 {
		x: number
		y: number
		z: number
		constructor(x?: number, y?: number, z?: number)
		set(x: number, y: number, z: number): this
		copy(v: Vector3): this
		add(v: Vector3): this
		normalize(): this
		length(): number
	}

	export class Matrix4 {
		elements: number[]
		compose(
			position: Vector3,
			quaternion: { x: number; y: number; z: number; w: number },
			scale: Vector3
		): this
	}

	export class Euler {
		x: number
		y: number
		z: number
		set(x: number, y: number, z: number): this
	}

	export class Quaternion {
		x: number
		y: number
		z: number
		w: number
		setFromEuler(euler: Euler): this
	}

	export class Object3D {
		name: string
		position: Vector3
		rotation: Euler
		scale: Vector3
		quaternion: Quaternion
		visible: boolean
		children: Object3D[]
		add(...objects: Object3D[]): this
		remove(...objects: Object3D[]): this
		lookAt(x: number, y: number, z: number): void
	}

	export class Scene extends Object3D {
		background: Color | null
		fog: Fog | FogExp2 | null
	}

	export class Fog {
		constructor(color: string | number, near?: number, far?: number)
	}

	export class FogExp2 {
		constructor(color: string | number, density?: number)
	}

	export class Camera extends Object3D {}

	export class PerspectiveCamera extends Camera {
		fov: number
		aspect: number
		near: number
		far: number
		constructor(
			fov?: number,
			aspect?: number,
			near?: number,
			far?: number
		)
		updateProjectionMatrix(): void
	}

	export class OrthographicCamera extends Camera {
		constructor(
			left: number,
			right: number,
			top: number,
			bottom: number,
			near?: number,
			far?: number
		)
		updateProjectionMatrix(): void
	}

	export class BufferAttribute {
		array: ArrayLike<number>
		count: number
		itemSize: number
		needsUpdate: boolean
		constructor(array: ArrayLike<number>, itemSize: number)
	}

	export class InstancedBufferAttribute extends BufferAttribute {}

	export class BufferGeometry {
		attributes: Record<string, BufferAttribute>
		dispose(): void
		setAttribute(
			name: string,
			attribute: BufferAttribute
		): this
		setFromPoints(points: Vector3[]): this
	}

	export class BoxGeometry extends BufferGeometry {
		constructor(
			width?: number,
			height?: number,
			depth?: number,
			widthSegments?: number,
			heightSegments?: number,
			depthSegments?: number
		)
	}

	export class SphereGeometry extends BufferGeometry {
		constructor(
			radius?: number,
			widthSegments?: number,
			heightSegments?: number
		)
	}

	export class PlaneGeometry extends BufferGeometry {
		constructor(
			width?: number,
			height?: number,
			widthSegments?: number,
			heightSegments?: number
		)
	}

	export class CylinderGeometry extends BufferGeometry {
		constructor(
			radiusTop?: number,
			radiusBottom?: number,
			height?: number,
			radialSegments?: number
		)
	}

	export class IcosahedronGeometry extends BufferGeometry {
		constructor(radius?: number, detail?: number)
	}

	export class CircleGeometry extends BufferGeometry {
		constructor(radius?: number, segments?: number)
	}

	export class TorusGeometry extends BufferGeometry {
		constructor(
			radius?: number,
			tube?: number,
			radialSegments?: number,
			tubularSegments?: number
		)
	}

	export class WireframeGeometry extends BufferGeometry {
		constructor(geometry: BufferGeometry)
	}

	export class Texture {
		needsUpdate: boolean
		wrapS: number
		wrapT: number
		dispose(): void
	}

	export class CanvasTexture extends Texture {
		constructor(canvas: HTMLCanvasElement)
	}

	export class DataTexture extends Texture {
		constructor(
			data: ArrayBufferView,
			width: number,
			height: number
		)
	}

	export const RepeatWrapping: number
	export const ClampToEdgeWrapping: number
	export const DoubleSide: number
	export const FrontSide: number
	export const BackSide: number
	export const AdditiveBlending: number
	export const NormalBlending: number

	export class Material {
		transparent: boolean
		opacity: number
		side: number
		depthWrite: boolean
		depthTest: boolean
		blending: number
		wireframe: boolean
		dispose(): void
	}

	export class MeshBasicNodeMaterial extends Material {
		colorNode: unknown
		positionNode: unknown
		opacityNode: unknown
		constructor(parameters?: Record<string, unknown>)
	}

	export class MeshStandardNodeMaterial extends Material {
		colorNode: unknown
		positionNode: unknown
		normalNode: unknown
		roughnessNode: unknown
		metalnessNode: unknown
		emissiveNode: unknown
		opacityNode: unknown
		roughness: number
		metalness: number
		constructor(parameters?: Record<string, unknown>)
	}

	export class MeshPhysicalNodeMaterial extends MeshStandardNodeMaterial {
		constructor(parameters?: Record<string, unknown>)
	}

	export class LineBasicMaterial extends Material {
		constructor(parameters?: Record<string, unknown>)
	}

	export class LineBasicNodeMaterial extends Material {
		colorNode: unknown
		constructor(parameters?: Record<string, unknown>)
	}

	export class PointsMaterial extends Material {
		size: number
		sizeAttenuation: boolean
		constructor(parameters?: Record<string, unknown>)
	}

	export class PointsNodeMaterial extends Material {
		positionNode: unknown
		colorNode: unknown
		sizeNode: unknown
		opacityNode: unknown
		constructor(parameters?: Record<string, unknown>)
	}

	export class SpriteNodeMaterial extends Material {
		positionNode: unknown
		colorNode: unknown
		rotationNode: unknown
		scaleNode: unknown
		opacityNode: unknown
		constructor(parameters?: Record<string, unknown>)
	}

	export class Mesh extends Object3D {
		geometry: BufferGeometry
		material: Material
		isMesh: true
		constructor(geometry?: BufferGeometry, material?: Material)
	}

	export class InstancedMesh extends Mesh {
		count: number
		instanceMatrix: { needsUpdate: boolean }
		constructor(
			geometry: BufferGeometry,
			material: Material,
			count: number
		)
		setMatrixAt(index: number, matrix: Matrix4): void
		setColorAt(index: number, color: Color): void
	}

	export class LineSegments extends Object3D {
		geometry: BufferGeometry
		material: Material
		constructor(geometry?: BufferGeometry, material?: Material)
	}

	export class Line extends Object3D {
		geometry: BufferGeometry
		material: Material
		constructor(geometry?: BufferGeometry, material?: Material)
	}

	export class Points extends Object3D {
		geometry: BufferGeometry
		material: Material
		constructor(geometry?: BufferGeometry, material?: Material)
	}

	export class Sprite extends Object3D {
		material: Material
		constructor(material?: Material)
	}

	export class Light extends Object3D {
		color: Color
		intensity: number
	}

	export class AmbientLight extends Light {
		constructor(color?: string | number, intensity?: number)
	}

	export class DirectionalLight extends Light {
		constructor(color?: string | number, intensity?: number)
	}

	export class PointLight extends Light {
		distance: number
		constructor(
			color?: string | number,
			intensity?: number,
			distance?: number
		)
	}

	export class HemisphereLight extends Light {
		constructor(
			sky?: string | number,
			ground?: string | number,
			intensity?: number
		)
	}

	export class Clock {
		getDelta(): number
		getElapsedTime(): number
	}

	export class Group extends Object3D {}

	export class GridHelper extends Object3D {
		constructor(
			size?: number,
			divisions?: number,
			color1?: string | number,
			color2?: string | number
		)
	}

	export type WebGPURendererInfo = {
		autoReset: boolean
		calls: number
		render: {
			calls: number
			frameCalls: number
			drawCalls: number
			triangles: number
			points: number
			lines: number
			timestamp: number
		}
		compute: {
			calls: number
			frameCalls: number
			timestamp: number
		}
		memory: {
			geometries: number
			textures: number
			attributes: number
			programs: number
			total: number
		}
	}

	export type WebGPUBackend = {
		isWebGPUBackend?: boolean
		isWebGLBackend?: boolean
	}

	export class RenderPipeline {
		outputNode: unknown
		outputColorTransform: boolean
		needsUpdate: boolean
		constructor(renderer: WebGPURenderer, outputNode?: unknown)
		render(): void
		dispose(): void
	}

	export class WebGPURenderer {
		domElement: HTMLCanvasElement
		backend: WebGPUBackend
		info: WebGPURendererInfo
		toneMapping: number
		outputColorSpace: string
		constructor(parameters?: {
			canvas?: HTMLCanvasElement
			antialias?: boolean
			forceWebGL?: boolean
			alpha?: boolean
		})
		init(): Promise<this>
		setSize(width: number, height: number): void
		setPixelRatio(value: number): void
		setAnimationLoop(
			callback: ((time: number) => void) | null
		): void
		render(scene: Scene, camera: Camera): void
		compute(node: unknown): void
		computeAsync(node: unknown): Promise<void>
		dispose(): void
	}
}

declare module "three/tsl" {
	export type TSLArg = TSLNode | number | string | boolean

	export interface TSLNode {
		readonly isNode?: boolean
		x: TSLNode
		y: TSLNode
		z: TSLNode
		w: TSLNode
		r: TSLNode
		g: TSLNode
		b: TSLNode
		a: TSLNode
		xy: TSLNode
		xyz: TSLNode
		rgb: TSLNode
		rgba: TSLNode
		value: unknown
		add(...args: TSLArg[]): TSLNode
		sub(...args: TSLArg[]): TSLNode
		mul(...args: TSLArg[]): TSLNode
		div(...args: TSLArg[]): TSLNode
		mod(v: TSLArg): TSLNode
		pow(v: TSLArg): TSLNode
		abs(): TSLNode
		saturate(): TSLNode
		negate(): TSLNode
		oneMinus(): TSLNode
		toVar(name?: string): TSLNode
		assign(v: TSLArg): TSLNode
		addAssign(v: TSLArg): TSLNode
		subAssign(v: TSLArg): TSLNode
		mulAssign(v: TSLArg): TSLNode
		toAttribute(): TSLNode
		element(index: TSLArg): TSLNode
		getTextureNode(name?: string): TSLNode
		getDepthNode(): TSLNode
		setMRT(value: unknown): TSLNode
	}

	export function float(v?: TSLArg): TSLNode
	export function int(v?: TSLArg): TSLNode
	export function uint(v?: TSLArg): TSLNode
	export function bool(v?: TSLArg): TSLNode
	export function vec2(x?: TSLArg, y?: TSLArg): TSLNode
	export function vec3(
		x?: TSLArg,
		y?: TSLArg,
		z?: TSLArg
	): TSLNode
	export function vec4(
		x?: TSLArg,
		y?: TSLArg,
		z?: TSLArg,
		w?: TSLArg
	): TSLNode
	export function color(
		r?: TSLArg,
		g?: TSLArg,
		b?: TSLArg
	): TSLNode
	export function mat3(...args: TSLArg[]): TSLNode
	export function mat4(...args: TSLArg[]): TSLNode

	export function add(...args: TSLArg[]): TSLNode
	export function sub(...args: TSLArg[]): TSLNode
	export function mul(...args: TSLArg[]): TSLNode
	export function div(...args: TSLArg[]): TSLNode
	export function pow(a: TSLArg, b: TSLArg): TSLNode
	export function mod(a: TSLArg, b: TSLArg): TSLNode
	export function abs(v: TSLArg): TSLNode
	export function min(a: TSLArg, b: TSLArg): TSLNode
	export function max(a: TSLArg, b: TSLArg): TSLNode
	export function clamp(
		v: TSLArg,
		minV?: TSLArg,
		maxV?: TSLArg
	): TSLNode
	export function mix(
		a: TSLArg,
		b: TSLArg,
		t: TSLArg
	): TSLNode
	export function step(edge: TSLArg, v: TSLArg): TSLNode
	export function smoothstep(
		e0: TSLArg,
		e1: TSLArg,
		v: TSLArg
	): TSLNode
	export function fract(v: TSLArg): TSLNode
	export function floor(v: TSLArg): TSLNode
	export function ceil(v: TSLArg): TSLNode
	export function sin(v: TSLArg): TSLNode
	export function cos(v: TSLArg): TSLNode
	export function tan(v: TSLArg): TSLNode
	export function distance(a: TSLArg, b: TSLArg): TSLNode
	export function length(v: TSLArg): TSLNode
	export function normalize(v: TSLArg): TSLNode
	export function dot(a: TSLArg, b: TSLArg): TSLNode
	export function cross(a: TSLArg, b: TSLArg): TSLNode

	export const uv: (index?: number) => TSLNode
	export const time: TSLNode
	export const positionLocal: TSLNode
	export const positionWorld: TSLNode
	export const positionView: TSLNode
	export const positionGeometry: TSLNode
	export const normalLocal: TSLNode
	export const normalWorld: TSLNode
	export const normalView: TSLNode
	export const cameraPosition: TSLNode
	export const cameraViewMatrix: TSLNode
	export const modelWorldMatrix: TSLNode
	export const instanceIndex: TSLNode
	export const vertexIndex: TSLNode

	export function uniform(
		value: unknown,
		type?: string
	): TSLNode
	export function texture(
		value: unknown,
		uvNode?: TSLArg
	): TSLNode
	export function varying(node: TSLArg, name?: string): TSLNode
	export function attribute(
		name: string,
		type?: string
	): TSLNode
	export function instancedBufferAttribute(
		attr: unknown
	): TSLNode
	export function instancedArray(
		count: number,
		type?: string
	): TSLNode
	export function Fn<T extends (...args: never[]) => unknown>(
		fn: T
	): T & ((...args: TSLArg[]) => TSLNode)
	export function pass(
		scene: unknown,
		camera: unknown
	): TSLNode
	export function renderOutput(node: TSLArg): TSLNode
	export function mx_noise_float(
		texcoord?: TSLArg,
		amplitude?: TSLArg,
		pivot?: TSLArg
	): TSLNode
	export function mx_noise_vec3(
		texcoord?: TSLArg,
		amplitude?: TSLArg,
		pivot?: TSLArg
	): TSLNode
	export function compute(
		node: TSLArg,
		count: number,
		workgroupSize?: number[]
	): TSLNode
	export function hash(n: TSLArg): TSLNode
	export function range(
		minV: TSLArg,
		maxV: TSLArg
	): TSLNode
	export function viewportUV(): TSLNode
	export function screenUV(): TSLNode
	export const viewportCoordinate: TSLNode
}

declare module "three/addons/controls/OrbitControls.js" {
	import type { Camera } from "three/webgpu"

	export class OrbitControls {
		enableDamping: boolean
		dampingFactor: number
		autoRotate: boolean
		autoRotateSpeed: number
		constructor(object: Camera, domElement?: HTMLElement)
		update(): void
		dispose(): void
		target: {
			set(x: number, y: number, z: number): void
			x: number
			y: number
			z: number
		}
	}
}

declare module "three/addons/tsl/display/BloomNode.js" {
	import type { TSLArg, TSLNode } from "three/tsl"

	export function bloom(
		node: TSLArg,
		strength?: TSLArg,
		radius?: TSLArg,
		threshold?: TSLArg
	): TSLNode
}

declare module "three/addons/tsl/display/RGBShiftNode.js" {
	import type { TSLArg, TSLNode } from "three/tsl"

	export function rgbShift(
		node: TSLArg,
		amount?: TSLArg,
		angle?: TSLArg
	): TSLNode
}

declare module "three/addons/tsl/display/FilmNode.js" {
	import type { TSLArg, TSLNode } from "three/tsl"

	export function film(
		inputNode: TSLArg,
		intensity?: TSLArg,
		scanlineIntensity?: TSLArg,
		greyscale?: TSLArg
	): TSLNode
}

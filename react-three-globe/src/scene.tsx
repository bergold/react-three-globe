import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useImperativeHandle, useRef } from "react";
import type { OrbitControls as OrbitControlsRef } from "three-stdlib";
import { GLOBE_RADIUS } from "./const";
import { Coordinate, deg2Rad } from "./coord";
import { Globe, GlobeProps } from "./layers/globe";

type Prefix<T, P extends string> = {
	[K in keyof T as `${P}${K extends string ? Capitalize<K> : never}`]: T[K];
};

export interface ThreeGlobeRef {
	pointOfView: (coords: Coordinate) => void;
}

export type ThreeGlobeProps = {
	globeRef?: React.Ref<ThreeGlobeRef>;

	/** Offset of the polar angle in radians used by `globeRef.pointOfView` */
	polarOffset?: number;
	/** Offset of the azimuth angle in radians used by `globeRef.pointOfView` */
	azimuthOffset?: number;

	children?: React.ReactNode;
} & Prefix<GlobeProps, "globe">;

export function ThreeGlobe({
	globeRef,
	polarOffset,
	azimuthOffset,
	children,
	...globe
}: ThreeGlobeProps) {
	const ctrl = useRef<OrbitControlsRef>(null);

	useImperativeHandle(
		globeRef,
		() => ({
			pointOfView: (coords) => {
				ctrl.current?.setPolarAngle(
					Math.PI / 2 - deg2Rad(coords.lat) + (polarOffset ?? 0),
				);
				ctrl.current?.setAzimuthalAngle(
					deg2Rad(coords.lng) + (azimuthOffset ?? 0),
				);
			},
		}),
		[polarOffset, azimuthOffset],
	);

	return (
		<Canvas frameloop="demand">
			<Suspense fallback={null}>
				{/* LIGHTS */}
				<ambientLight color={0xcccccc} intensity={Math.PI} />
				<directionalLight color={0xffffff} intensity={0.6 * Math.PI} />
				{/* CAMERA */}
				<PerspectiveCamera makeDefault position={[0, 0, GLOBE_RADIUS * 2.5]} />
				{/* CONTROLS */}
				<OrbitControls
					ref={ctrl}
					makeDefault
					onStart={() => {
						// Note: This prevents the user from selecting text, when dragging the globe
						document.body.style.userSelect = "none";
					}}
					onEnd={() => {
						document.body.style.userSelect = "";
					}}
					minDistance={110}
					maxDistance={800}
					// enablePan={false}
				/>
				<Globe texture={globe.globeTexture} />
				{children}
			</Suspense>
		</Canvas>
	);
}

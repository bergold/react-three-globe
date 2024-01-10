import {
	MapControls,
	OrbitControls,
	OrthographicCamera,
	PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useImperativeHandle, useLayoutEffect, useRef } from "react";
import type {
	MapControls as MapControlsRef,
	OrbitControls as OrbitControlsRef,
} from "three-stdlib";

import { GLOBE_RADIUS } from "./const";
import { GlobeContextProvider } from "./context";
import { Coordinate, deg2Rad } from "./coord";

export interface RootRef {
	pointOfView: (coords: Coordinate) => void;
}

export type RootProps = {
	globeRef?: React.Ref<RootRef>;

	/** X coordinate of the center point relative to the canvas size. 0 = left, 0.5 = center, 1 = right */
	originX?: number;
	/** Y coordinate of the center point relative to the canvas size. 0 = top, 0.5 = center, 1 = bottom */
	originY?: number;

	projection?: "3d" | "equirectangular";

	/** Offset of the polar angle in radians used by `globeRef.pointOfView` */
	polarOffset?: number;
	/** Offset of the azimuth angle in radians used by `globeRef.pointOfView` */
	azimuthOffset?: number;

	children?: React.ReactNode;
};

function Scene({
	globeRef,
	originX: offsetX,
	originY: offsetY,
	projection = "3d",
	polarOffset,
	azimuthOffset,
	children,
}: RootProps) {
	const getThree = useThree((state) => state.get);
	const ctrl = useRef<OrbitControlsRef | MapControlsRef>(null);

	useImperativeHandle(
		globeRef,
		() => ({
			pointOfView: (coords) => {
				if (projection === "equirectangular") {
					// TODO: implement
				}
				if (projection === "3d") {
					ctrl.current?.setPolarAngle(
						Math.PI / 2 - deg2Rad(coords.lat) + (polarOffset ?? 0),
					);
					ctrl.current?.setAzimuthalAngle(
						deg2Rad(coords.lng) + (azimuthOffset ?? 0),
					);
				}
			},
		}),
		[projection, polarOffset, azimuthOffset],
	);

	useLayoutEffect(() => {
		const { camera, size } = getThree();
		camera.setViewOffset(
			size.width * 2,
			size.height * 2,
			(1 - (offsetX ?? 0.5)) * size.width,
			(1 - (offsetY ?? 0.5)) * size.height,
			size.width,
			size.height,
		);
	}, [getThree, offsetX, offsetY]);

	return (
		<>
			{/* LIGHTS */}
			<ambientLight color={0xcccccc} intensity={Math.PI} />
			<directionalLight color={0xffffff} intensity={0.6 * Math.PI} />
			{/* CAMERA */}
			{projection === "3d" ? (
				<PerspectiveCamera makeDefault position={[0, 0, GLOBE_RADIUS * 5]} />
			) : projection === "equirectangular" ? (
				<OrthographicCamera makeDefault position={[0, 0, GLOBE_RADIUS * 5]} />
			) : null}
			{/* CONTROLS */}
			{projection === "3d" ? (
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
					enablePan={false}
				/>
			) : projection === "equirectangular" ? (
				<MapControls
					ref={ctrl}
					makeDefault
					onStart={() => {
						// Note: This prevents the user from selecting text, when dragging the globe
						document.body.style.userSelect = "none";
					}}
					onEnd={() => {
						document.body.style.userSelect = "";
					}}
					screenSpacePanning={true}
					minPolarAngle={Math.PI / 2}
					maxPolarAngle={Math.PI / 2}
					minAzimuthAngle={0}
					maxAzimuthAngle={0}
				/>
			) : null}

			<GlobeContextProvider value={{ projection }}>
				{children}
			</GlobeContextProvider>
		</>
	);
}

export function Root(props: RootProps) {
	return (
		<Canvas frameloop="demand">
			<Suspense fallback={null}>
				<Scene {...props} />
			</Suspense>
		</Canvas>
	);
}

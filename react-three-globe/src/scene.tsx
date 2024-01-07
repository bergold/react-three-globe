import {
	MapControls,
	OrbitControls,
	OrthographicCamera,
	PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
	Suspense,
	createContext,
	useContext,
	useImperativeHandle,
	useRef,
} from "react";
import type {
	MapControls as MapControlsRef,
	OrbitControls as OrbitControlsRef,
} from "three-stdlib";
import { GLOBE_RADIUS } from "./const";
import { Coordinate, deg2Rad } from "./coord";

export interface ThreeGlobeRef {
	pointOfView: (coords: Coordinate) => void;
}

export type ThreeGlobeProps = {
	globeRef?: React.Ref<ThreeGlobeRef>;

	projection?: "3d" | "equirectangular";

	/** Offset of the polar angle in radians used by `globeRef.pointOfView` */
	polarOffset?: number;
	/** Offset of the azimuth angle in radians used by `globeRef.pointOfView` */
	azimuthOffset?: number;

	children?: React.ReactNode;
};

type GlobeContextState = {
	projection: ThreeGlobeProps["projection"];
};
const GlobeContext = createContext<GlobeContextState | null>(null);
export function useGlobeContext(debugName: string) {
	const ctx = useContext(GlobeContext);
	if (!ctx)
		throw new Error(
			`<${debugName}> must be used within the <ThreeGlobe> component`,
		);
	return ctx;
}

export function ThreeGlobe({
	globeRef,
	projection = "3d",
	polarOffset,
	azimuthOffset,
	children,
	...globe
}: ThreeGlobeProps) {
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

	return (
		<Canvas frameloop="demand">
			<Suspense fallback={null}>
				{/* LIGHTS */}
				<ambientLight color={0xcccccc} intensity={Math.PI} />
				<directionalLight color={0xffffff} intensity={0.6 * Math.PI} />
				{/* CAMERA */}
				{projection === "3d" ? (
					<PerspectiveCamera
						makeDefault
						position={[0, 0, GLOBE_RADIUS * 2.5]}
					/>
				) : projection === "equirectangular" ? (
					<OrthographicCamera
						makeDefault
						position={[0, 0, GLOBE_RADIUS * 2.5]}
					/>
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

				<GlobeContext.Provider value={{ projection }}>
					{children}
				</GlobeContext.Provider>
			</Suspense>
		</Canvas>
	);
}

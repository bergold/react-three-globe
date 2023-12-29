import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useImperativeHandle, useRef } from "react";
import type { OrbitControls as OrbitControlsRef } from "three-stdlib";
import { GLOBE_RADIUS } from "./const";
import { Coordinate, deg2Rad } from "./coord";
import { Globe } from "./layers/globe";

export interface ThreeGlobeRef {
	pointOfView: (coords: Coordinate) => void;
}

export interface ThreeGlobeProps {
	globeRef?: React.Ref<ThreeGlobeRef>;
	children?: React.ReactNode;
}

export function ThreeGlobe(props: ThreeGlobeProps) {
	return (
		<Canvas>
			<Suspense fallback={null}>
				<ambientLight color={0xcccccc} intensity={Math.PI} />
				<directionalLight color={0xffffff} intensity={0.6 * Math.PI} />
				<PerspectiveCamera makeDefault position={[0, 0, GLOBE_RADIUS * 2.5]} />
				<_ThreeGlobe {...props} />
			</Suspense>
		</Canvas>
	);
}

function _ThreeGlobe({ globeRef, children }: ThreeGlobeProps) {
	const ctrl = useRef<OrbitControlsRef>(null);

	useImperativeHandle(globeRef, () => ({
		pointOfView: (coords) => {
			// TODO: Verify implementation
			console.log("-> pointOfView", coords);
			ctrl.current?.setPolarAngle(deg2Rad(coords.lat));
			ctrl.current?.setAzimuthalAngle(deg2Rad(coords.lng));
		},
	}));

	return (
		<>
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
			/>
			<Globe />
			{children}
		</>
	);
}

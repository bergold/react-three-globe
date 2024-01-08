import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { GLOBE_RADIUS } from "../core/const";
import { Coordinate, useVec3 } from "../core/coord";

export interface MarkerProps {
	coordinate: Coordinate;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function Marker({ coordinate, children, ...div }: MarkerProps) {
	const htmlRef = useRef<HTMLDivElement>(null);

	const vec = useVec3("Marker", coordinate);

	useFrame(({ camera }) => {
		if (htmlRef.current) {
			// Rotate the marker vector to the camera's orientation
			const { x, y, z } = vec
				.clone()
				.add(camera.position)
				.applyMatrix4(camera.matrixWorldInverse);

			const r = Math.sqrt(x * x + y * y);

			htmlRef.current.style.setProperty("--marker-r", `${r / GLOBE_RADIUS}`);
			htmlRef.current.style.setProperty("--marker-z", `${z / GLOBE_RADIUS}`);
		}
	});

	return (
		<Html {...div} position={vec} ref={htmlRef}>
			{children}
		</Html>
	);
}

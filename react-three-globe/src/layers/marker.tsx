import { Coordinates, useVec3 } from "../core/coord";
import { Html } from "../html/html";

export interface MarkerProps {
	coordinates: Coordinates;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function Marker({ coordinates, children, ...div }: MarkerProps) {
	const vec = useVec3("Marker", coordinates, 0.01);
	return (
		<Html {...div} position={vec}>
			{children}
		</Html>
	);
}

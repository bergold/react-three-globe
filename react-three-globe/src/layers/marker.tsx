import { Html } from "@react-three/drei";
import { Coordinate, polar2Cartesian } from "../coord";

export interface MarkerProps {
	coordinate: Coordinate;
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function Marker({ coordinate, children, ...div }: MarkerProps) {
	const vec = polar2Cartesian(coordinate, 0.01);
	return (
		<Html {...div} position={vec} occlude>
			{children}
		</Html>
	);
}

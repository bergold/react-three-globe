import { Coordinate, polar2Cartesian } from "../coord";

export function Marker({ coordinate }: { coordinate: Coordinate }) {
	const { x, y, z } = polar2Cartesian(coordinate);

	return (
		<mesh position={[x, y, z]}>
			<sphereGeometry args={[2, 32, 32]} />
			<meshStandardMaterial color="red" />
		</mesh>
	);
}

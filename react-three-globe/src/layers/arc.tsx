import { useMemo } from "react";
import { Curve, Vector3 } from "three";
import { Coordinate, useVec3 } from "../coord";

const SEGMENTS = 64;
const RADIUS = 2;
const RADIAL_SEGMENTS = 12;

export interface ArcProps {
	from: Coordinate;
	to: Coordinate;
	color?: string;
	children?: React.ReactNode;
}

export function Arc(props: ArcProps) {
	const from = useVec3("Arc", props.from);
	const to = useVec3("Arc", props.to);
	const curve = useMemo(() => new SphereArc(from, to), [from, to]);

	return (
		<mesh>
			<tubeGeometry args={[curve, SEGMENTS, RADIUS, RADIAL_SEGMENTS]} />
			<meshPhongMaterial color={props.color ?? "#ed758f"} />
		</mesh>
	);
}

class SphereArc extends Curve<Vector3> {
	readonly from: Vector3;
	readonly to: Vector3;
	readonly angle: number;

	constructor(from: Vector3, to: Vector3) {
		super();
		this.from = from;
		this.to = to;
		this.angle = from.angleTo(to);
	}

	override getPoint(t: number) {
		if (this.angle === 0) return this.from.clone(); // points exactly overlap

		return new Vector3()
			.addVectors(
				this.from.clone().multiplyScalar(Math.sin((1 - t) * this.angle)),
				this.to.clone().multiplyScalar(Math.sin(t * this.angle)),
			)
			.divideScalar(Math.sin(this.angle));
	}
}

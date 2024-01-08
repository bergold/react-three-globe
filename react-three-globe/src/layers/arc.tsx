import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { Curve, Vector3 } from "three";
import { Coordinate, useVec3 } from "../coord";

const SEGMENTS = 64;

export interface ArcProps {
	from: Coordinate;
	to: Coordinate;
	color?: string;
	lineWidth?: number;
	children?: React.ReactNode;
}

export function Arc(props: ArcProps) {
	const from = useVec3("Arc", props.from, 0.01);
	const to = useVec3("Arc", props.to, 0.01);
	const curve = useMemo(
		() => new SphereArc(from, to).getPoints(SEGMENTS),
		[from, to],
	);

	return (
		<Line
			points={curve}
			color={props.color ?? "#ffffff"}
			lineWidth={props.lineWidth ?? 10}
		/>
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

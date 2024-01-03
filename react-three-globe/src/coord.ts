import { useMemo } from "react";
import { Vector3 } from "three";
import { GLOBE_RADIUS } from "./const";

export type Coordinate = { lat: number; lng: number };

export function useVec3({ lat, lng }: Coordinate, relAltitude?: number) {
	return useMemo(
		() => new Vector3(...polar2Cartesian({ lat, lng }, relAltitude)),
		[lat, lng, relAltitude],
	);
}

export function polar2Cartesian(
	{ lat, lng }: Coordinate,
	relAltitude?: number,
) {
	const phi = ((90 - lat) * Math.PI) / 180;
	const theta = ((90 - lng) * Math.PI) / 180;
	const r = GLOBE_RADIUS * (1 + (relAltitude ?? 0));
	return [
		r * Math.sin(phi) * Math.cos(theta),
		r * Math.cos(phi),
		r * Math.sin(phi) * Math.sin(theta),
	] as const;
}

export function deg2Rad(deg: number) {
	return (deg * Math.PI) / 180;
}
export function rad2Deg(rad: number) {
	return (rad / Math.PI) * 180;
}

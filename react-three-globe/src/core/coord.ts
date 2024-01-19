import { useMemo } from "react";
import { Vector3 } from "three";

import { GLOBE_RADIUS } from "./const";
import { useGlobeContext } from "./context";

export type Coordinates = { lat: number; lng: number };

export function useVec3(
	debugName: string,
	{ lat, lng }: Coordinates,
	relAltitude?: number,
) {
	const { projection } = useGlobeContext(debugName);
	return useMemo(
		() =>
			projection === "3d"
				? new Vector3(...polar2Cartesian({ lat, lng }, relAltitude))
				: new Vector3(
						deg2Rad(lng) * GLOBE_RADIUS,
						deg2Rad(lat) * GLOBE_RADIUS,
						relAltitude ?? 0,
				  ),
		[projection, lat, lng, relAltitude],
	);
}

export function polar2Cartesian(
	{ lat, lng }: Coordinates,
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

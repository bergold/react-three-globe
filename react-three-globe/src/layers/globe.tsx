import { useTexture } from "@react-three/drei";

import { GLOBE_RADIUS } from "../core/const";
import { useGlobeContext } from "../core/context";

export interface GlobeProps {
	texture: string;
}

export function Globe({ texture }: GlobeProps) {
	const { projection } = useGlobeContext("Globe");
	const globeImage = useTexture(texture, (t) => {
		t.colorSpace = "srgb";
	});

	if (projection === "equirectangular") {
		return (
			<mesh>
				<planeGeometry
					args={[GLOBE_RADIUS * 2 * Math.PI, GLOBE_RADIUS * Math.PI]}
				/>
				<meshLambertMaterial map={globeImage} />
			</mesh>
		);
	}
	if (projection === "3d") {
		return (
			<mesh rotation={[0, -Math.PI / 2 /* -90° */, 0]}>
				<sphereGeometry args={[GLOBE_RADIUS, 75, 75]} />
				<meshLambertMaterial map={globeImage} />
			</mesh>
		);
	}
	return null;
}

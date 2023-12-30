import { useTexture } from "@react-three/drei";
import { GLOBE_RADIUS } from "../const";

export interface GlobeProps {
	texture: string;
}

export function Globe({ texture }: GlobeProps) {
	const globeImage = useTexture(texture, (t) => {
		t.colorSpace = "srgb";
	});

	return (
		<mesh rotation={[0, -Math.PI / 2 /* -90° */, 0]}>
			<sphereGeometry args={[GLOBE_RADIUS, 75, 75]} />
			<meshPhongMaterial map={globeImage} />
		</mesh>
	);
}

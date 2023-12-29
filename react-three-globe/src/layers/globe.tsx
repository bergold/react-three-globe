import { useTexture } from "@react-three/drei";
import { GLOBE_RADIUS } from "../const";

export function Globe() {
	const globeImage = useTexture(
		"https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
		(t) => {
			t.colorSpace = "srgb";
		},
	);

	return (
		<mesh rotation={[0, -Math.PI / 2 /* -90° */, 0]}>
			<sphereGeometry args={[GLOBE_RADIUS, 75, 75]} />
			<meshPhongMaterial map={globeImage} />
		</mesh>
	);
}

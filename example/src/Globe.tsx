import { useEffect, useRef } from "react";
import { Marker, ThreeGlobe, type ThreeGlobeRef } from "react-three-globe";

/**
 * TODO:
 * - Arcs between locations
 * - Support different projections
 * - Highlight countries
 */

const MARKER = [
	{ label: "Berlin", coords: { lat: 52.52, lng: 13.405 } },
	{ label: "London", coords: { lat: 51.5074, lng: 0.1278 } },
	{ label: "Paris", coords: { lat: 48.8566, lng: 2.3522 } },
	{ label: "New York", coords: { lat: 40.7128, lng: -74.006 } },
	{ label: "Moscow", coords: { lat: 55.7558, lng: 37.6173 } },
	{ label: "Tokyo", coords: { lat: 35.6762, lng: 139.6503 } },
	{ label: "Sydney", coords: { lat: -33.8688, lng: 151.2093 } },
];

export default function Globe() {
	const globe = useRef<ThreeGlobeRef>(null);

	useEffect(() => {
		const t = window.setTimeout(() => {
			globe.current?.pointOfView({ lat: 52.52, lng: 13.405 });
		}, 1000);
		return () => {
			window.clearTimeout(t);
		};
	}, []);

	return (
		<div style={{ width: "100vw", height: "100vh", background: "#eee" }}>
			<ThreeGlobe
				globeRef={globe}
				globeTexture="https://unpkg.com/three-globe/example/img/earth-day.jpg"
			>
				{MARKER.map(({ label, coords }) => (
					<CityMarker
						key={label}
						label={label}
						coords={coords}
						onClick={() => globe.current?.pointOfView(coords)}
					/>
				))}
			</ThreeGlobe>
		</div>
	);
}

function CityMarker({
	label,
	coords,
	onClick,
}: (typeof MARKER)[number] & { onClick: () => void }) {
	return (
		<Marker coordinate={coords}>
			<div className="city-marker">
				<button type="button" onClick={onClick}>
					{label}
				</button>
				<svg
					aria-hidden="true"
					width="10"
					height="5"
					viewBox="0 0 30 10"
					preserveAspectRatio="none"
				>
					<polygon points="0,0 30,0 15,10" />
				</svg>
			</div>
		</Marker>
	);
}

// export default function Globe() {
// 	const globe = useRef();

// 	const foo = () => {
// 		globe.current?.pointOfView({ lat: 51.5074, lng: 0.1278 }, 5000);
// 	}

// 	return (
// 		<div style={{ width: "100vw", height: "100vh", background: "#eee" }}>
// 			<ThreeGlobe ref={globe} projection={true ? "3d" : "equidist"}>
// 				{/* Highlight location */}
// 				<Marker lat={51.5074} lng={0.1278} />
// 				<Marker coords={[51.5074, 0.1278]} />
// 				{/* Connection between locations */}
// 				<Arc from={[51.5074, 0.1278]} to={[40.7128, -74.006]} width={2}>
// 					<Label position="middle">Hi there</Label>
// 				</Arc>
// 				{/* Location dot */}
// 				<Dot lat={40.7128} lng={-74.006} />
// 			</ThreeGlobe>
// 		</div>
// 	);
// }

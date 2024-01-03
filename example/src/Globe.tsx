import { Perf } from "r3f-perf";
import { useEffect, useRef } from "react";
import { Marker, ThreeGlobe, type ThreeGlobeRef } from "react-three-globe";

/**
 * TODO:
 * - Arcs between locations
 * - Support different projections
 * - Graticules (every 10 degrees)
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
		<div
			style={{
				// create a new stacking context
				position: "relative",
				zIndex: 0,

				width: "100vw",
				height: "100vh",
				background: "#eee",
			}}
		>
			<ThreeGlobe
				globeRef={globe}
				globeTexture="/texture.png"
				polarOffset={0.2}
			>
				<Perf />
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

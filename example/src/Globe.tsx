import { useEffect, useRef } from "react";
import { Marker, ThreeGlobe, type ThreeGlobeRef } from "react-three-globe";

/**
 * TODO:
 * - Support different projections
 * - Arcs between locations
 * - Highlight countries
 */

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
			<ThreeGlobe globeRef={globe}>
				{/* Berlin */}
				<Marker coordinate={{ lat: 52.52, lng: 13.405 }} />
				{/* London */}
				<Marker coordinate={{ lat: 51.5074, lng: 0.1278 }} />
				{/* Paris */}
				<Marker coordinate={{ lat: 48.8566, lng: 2.3522 }} />
				{/* New York */}
				<Marker coordinate={{ lat: 40.7128, lng: -74.006 }} />
				{/* Moscow */}
				<Marker coordinate={{ lat: 55.7558, lng: 37.6173 }} />
				{/* Tokyo */}
				<Marker coordinate={{ lat: 35.6762, lng: 139.6503 }} />
				{/* Sydney */}
				<Marker coordinate={{ lat: -33.8688, lng: 151.2093 }} />
			</ThreeGlobe>
		</div>
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

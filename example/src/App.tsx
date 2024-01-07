import React, { Suspense, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Globe = React.lazy(() => import("./Globe"));

export default function App() {
	const [projection, setProjection] = React.useState<"3d" | "equirectangular">(
		"3d",
	);
	const [, startTransition] = useTransition();

	return (
		<>
			<ErrorBoundary
				fallback={
					<div
						style={{
							width: "100vw",
							height: "100vh",
							background: "#eee",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div>Error</div>
					</div>
				}
			>
				<Suspense
					fallback={
						<div
							style={{
								width: "100vw",
								height: "100vh",
								background: "#eee",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<div>Loading...</div>
						</div>
					}
				>
					<Globe key={projection} projection={projection} />
				</Suspense>
			</ErrorBoundary>
			<Options
				setProjection={(v) => {
					startTransition(() => {
						setProjection(v);
					});
				}}
			/>
		</>
	);
}

function Options({
	setProjection,
}: { setProjection: (projection: "3d" | "equirectangular") => void }) {
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
			}}
		>
			<div
				style={{
					background: "rgba(36, 36, 36, 0.9)",
					padding: "4px 12px",
					color: "#fff",
				}}
			>
				<h1 style={{ fontSize: "1.2rem", margin: "4px 0" }}>
					react-three-globe
				</h1>
				<form
					onChange={(e) =>
						setProjection(
							new FormData(e.currentTarget).get("projection") as
								| "3d"
								| "equirectangular",
						)
					}
				>
					<label>
						<input type="radio" name="projection" value="3d" defaultChecked />
						3D
					</label>
					<label>
						<input type="radio" name="projection" value="equirectangular" />
						Equirectangular
					</label>
				</form>
			</div>
		</div>
	);
}

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Globe = React.lazy(() => import("./Globe"));

export default function App() {
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
					<Globe />
				</Suspense>
			</ErrorBoundary>
			<Options />
		</>
	);
}

function Options() {
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
			</div>
		</div>
	);
}

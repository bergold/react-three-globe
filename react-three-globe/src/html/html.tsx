import { ReactThreeFiber, useFrame, useThree } from "@react-three/fiber";
import React from "react";
import {
	Camera,
	Group,
	Object3D,
	OrthographicCamera,
	PerspectiveCamera,
	Quaternion,
	Vector3,
} from "three";
import { TunnelIn } from "../core/tunnel";

const EPS = 0.001;
const Z_INDEX_RANGE = [16777271, 0] as const;

const v1 = /* @__PURE__ */ new Vector3();
const v2 = /* @__PURE__ */ new Vector3();
const q1 = /* @__PURE__ */ new Quaternion();

function calculatePosition(
	el: Object3D,
	camera: Camera,
	size: { width: number; height: number },
) {
	const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
	objectPos.project(camera);
	const widthHalf = size.width / 2;
	const heightHalf = size.height / 2;
	return [
		objectPos.x * widthHalf + widthHalf,
		-(objectPos.y * heightHalf) + heightHalf,
	] as const;
}

function getObjectZ(el: Object3D, camera: Camera) {
	const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
	const cameraRot = q1.setFromRotationMatrix(camera.matrixWorldInverse);
	objectPos.applyQuaternion(cameraRot);
	return objectPos.z;
}

function objectZIndex(el: Object3D, camera: Camera) {
	if (
		camera instanceof PerspectiveCamera ||
		camera instanceof OrthographicCamera
	) {
		const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
		const cameraPos = v2.setFromMatrixPosition(camera.matrixWorld);
		const dist = objectPos.distanceTo(cameraPos);
		const A =
			(Z_INDEX_RANGE[1] - Z_INDEX_RANGE[0]) / (camera.far - camera.near);
		const B = Z_INDEX_RANGE[1] - A * camera.far;
		return Math.round(A * dist + B);
	}
	return undefined;
}

function getState(occluded: boolean) {
	return occluded ? "occluded" : "visible";
}

type ThreeGroupProps = ReactThreeFiber.Object3DNode<Group, typeof Group>;

export interface HtmlProps {
	position: ThreeGroupProps["position"];
	occlusionOffset?: number;
	occlusionEps?: number;

	className?: string;
	style?: React.CSSProperties;

	children?: React.ReactNode;
}

export function Html({
	position,
	occlusionOffset = 0,
	occlusionEps = 1,

	className,
	style,

	children,
}: HtmlProps) {
	const elRef = React.useRef<HTMLDivElement>(null);
	const groupRef = React.useRef<Group>(null);

	const camera = useThree((state) => state.camera);
	const scene = useThree((state) => state.scene);
	const size = useThree((state) => state.size);

	const oldZoom = React.useRef(0);
	const oldPosition = React.useRef<readonly [number, number]>([0, 0]);
	const oldOccluded = React.useRef<boolean | null>(null);

	React.useLayoutEffect(() => {
		if (elRef.current && groupRef.current) {
			scene.updateMatrixWorld();

			const vec = calculatePosition(groupRef.current, camera, size);
			const occluded =
				getObjectZ(groupRef.current, camera) - occlusionOffset < 0;

			elRef.current.style.zIndex = `${objectZIndex(groupRef.current, camera)}`;
			elRef.current.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0)`;
			elRef.current.dataset.state = getState(occluded);
		}
	}, [scene, camera, size, occlusionOffset]);

	useFrame(() => {
		if (elRef.current && groupRef.current) {
			camera.updateMatrixWorld();
			groupRef.current.updateWorldMatrix(true, false);
			const vec = calculatePosition(groupRef.current, camera, size);
			const occluded =
				getObjectZ(groupRef.current, camera) -
					occlusionOffset +
					(oldOccluded.current === null
						? 0
						: oldOccluded.current
						  ? -occlusionEps
						  : occlusionEps) <
				0;

			if (oldOccluded.current !== occluded) {
				elRef.current.dataset.state = getState(occluded);
				oldOccluded.current = occluded;
			}

			if (
				Math.abs(oldZoom.current - camera.zoom) > EPS ||
				Math.abs(oldPosition.current[0] - vec[0]) > EPS ||
				Math.abs(oldPosition.current[1] - vec[1]) > EPS
			) {
				elRef.current.style.zIndex = `${objectZIndex(
					groupRef.current,
					camera,
				)}`;
				elRef.current.style.transform = `translate3d(${vec[0]}px,${vec[1]}px,0)`;

				oldPosition.current = vec;
				oldZoom.current = camera.zoom;
			}
		}
	});

	return (
		<>
			<group ref={groupRef} position={position} />
			<TunnelIn>
				<div
					ref={elRef}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						transformOrigin: "0 0",
						...style,
					}}
					className={className}
				>
					{children}
				</div>
			</TunnelIn>
		</>
	);
}

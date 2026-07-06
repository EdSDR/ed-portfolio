import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Experience } from "./experience";

const BASE_POSITION = new THREE.Vector3(1, 2, 6);
const LOOK_TARGET = new THREE.Vector3(0, 0.5, 0);

function CameraRig() {
	const pointer = useRef({ x: 0, y: 0 });

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener("pointermove", handlePointerMove);
		return () => window.removeEventListener("pointermove", handlePointerMove);
	}, []);

	useFrame((state, delta) => {
		const { camera } = state;
		camera.position.x = THREE.MathUtils.damp(
			camera.position.x,
			BASE_POSITION.x + pointer.current.x * 0.4,
			2.5,
			delta,
		);
		camera.position.y = THREE.MathUtils.damp(
			camera.position.y,
			BASE_POSITION.y - pointer.current.y * 0.3,
			2.5,
			delta,
		);
		camera.lookAt(LOOK_TARGET);
	});

	return null;
}

export function PortalScene() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
			<Canvas
				flat
				dpr={[1, 2]}
				camera={{ fov: 45, near: 0.1, far: 200, position: [1, 2, 6] }}
			>
				<color args={["#030202"]} attach="background" />
				<Suspense fallback={null}>
					<Experience />
				</Suspense>
				<CameraRig />
			</Canvas>
			<div className="absolute inset-0 bg-black/45" />
		</div>
	);
}

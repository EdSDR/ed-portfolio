import type { CameraControls as CameraControlsImpl } from "@react-three/drei";
import {
	CameraControls,
	ContactShadows,
	Environment,
	Lightformer,
	Preload,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import { ClientOnly } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Group } from "three";
import { Box3, Vector3 } from "three";
import { CameraDebugPanel } from "#/components/portal-background/camera-debug-panel";
import {
	CAMERA_INITIAL_POSITION,
	CAMERA_INITIAL_TARGET,
	CIRCLE_LIGHTFORMERS,
	ENVIRONMENT_HDRI_URL,
	FLOOR_AND_WALL_COLLIDERS,
	PORTAL_BACKGROUND_COLOR,
} from "#/components/portal-background/constants";
import { Letter } from "#/components/portal-background/letter";
import { usePortalFocus } from "#/components/portal-background/portal-focus-context";
import { BasicSandbox } from "#/components/portal-background/sandboxes/basic-sandbox";
import { PingPongSandbox } from "#/components/portal-background/sandboxes/ping-pong-sandbox";
import { RocketSandbox } from "#/components/portal-background/sandboxes/rocket-sandbox";
import { ShoeSandbox } from "#/components/portal-background/sandboxes/shoe-sandbox";
import { StencilSandbox } from "#/components/portal-background/sandboxes/stencil-sandbox";
import { TurtleSandbox } from "#/components/portal-background/sandboxes/turtle-sandbox";
import { SceneDebugPanel } from "#/components/portal-background/scene-debug-panel";

const TOP_VIEW_EPSILON = 0.001;
const TOP_VIEW_PADDING_FACTOR = 2.5;
const TOP_VIEW_MIN_DISTANCE = 15;

function useIdleMount() {
	const [isIdle, setIsIdle] = useState(false);

	useEffect(() => {
		if (typeof window.requestIdleCallback === "function") {
			const id = window.requestIdleCallback(() => setIsIdle(true), {
				timeout: 1500,
			});
			return () => window.cancelIdleCallback(id);
		}
		const id = window.setTimeout(() => setIsIdle(true), 300);
		return () => window.clearTimeout(id);
	}, []);

	return isIdle;
}

export function PortalBackground() {
	const isIdle = useIdleMount();
	const cameraControlsRef = useRef<CameraControlsImpl>(null);
	const hasSetInitialCameraLookAt = useRef(false);
	const [backgroundColor, setBackgroundColor] = useState(
		PORTAL_BACKGROUND_COLOR,
	);
	const { isFocused, setFocused } = usePortalFocus();

	const setCameraControlsRef = useCallback(
		(instance: CameraControlsImpl | null) => {
			cameraControlsRef.current = instance;
			if (instance && !hasSetInitialCameraLookAt.current) {
				hasSetInitialCameraLookAt.current = true;
				instance.setLookAt(
					...CAMERA_INITIAL_POSITION,
					...CAMERA_INITIAL_TARGET,
					false,
				);
			}
		},
		[],
	);

	const handleSelectLetter = useCallback((letter: Group) => {
		const controls = cameraControlsRef.current;
		if (!controls) return;

		const box = new Box3().setFromObject(letter);
		const center = box.getCenter(new Vector3());
		const size = box.getSize(new Vector3());
		const distance = Math.max(
			Math.max(size.x, size.z) * TOP_VIEW_PADDING_FACTOR,
			TOP_VIEW_MIN_DISTANCE,
		);

		controls.setLookAt(
			center.x,
			center.y + distance,
			center.z + TOP_VIEW_EPSILON,
			center.x,
			center.y,
			center.z,
			true,
		);
		setFocused(true);
	}, [setFocused]);

	const handleClose = useCallback(() => {
		const controls = cameraControlsRef.current;
		if (controls) {
			controls.setLookAt(
				...CAMERA_INITIAL_POSITION,
				...CAMERA_INITIAL_TARGET,
				true,
			);
		}
		setFocused(false);
	}, [setFocused]);

	return (
		<ClientOnly>
			{isIdle && (
				<>
					{import.meta.env.DEV && (
						<>
							<CameraDebugPanel
								controlsRef={cameraControlsRef}
								defaultPosition={CAMERA_INITIAL_POSITION}
								defaultTarget={CAMERA_INITIAL_TARGET}
							/>
							<SceneDebugPanel
								backgroundColor={backgroundColor}
								onBackgroundColorChange={setBackgroundColor}
							/>
						</>
					)}
					<Canvas
						dpr={[1.5, 2]}
						camera={{
							position: CAMERA_INITIAL_POSITION,
							fov: 45,
							near: 1,
							far: 300,
						}}
					>
						<color attach="background" args={[backgroundColor]} />
						<Physics gravity={[0, -60, 0]}>
							<Letter
								char="E"
								position={[1, 50, -1]}
								rotation={[0, 0, 0]}
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<TurtleSandbox />
							</Letter>
							<Letter
								char="D"
								position={[2, 60, -2]}
								rotation={[4, 5, 6]}
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<ShoeSandbox scale={5} />
							</Letter>
							<Letter
								char="S"
								position={[-1, 80, 3]}
								rotation={[10, 11, 12]}
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<RocketSandbox position={[-1, -1, 0]} scale={0.6} />
							</Letter>
							{/* <Letter
								char="S"
								position={[-1, 80, 3]}
								rotation={[10, 11, 12]}
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<BasicSandbox scale={3} />
							</Letter> */}
							<Letter
								char="D"
								position={[-2, 90, 2]}
								rotation={[13, 14, 15]}
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<PingPongSandbox />
							</Letter>
							<Letter
								char="R"
								position={[-3, 100, -3]}
								rotation={[16, 17, 18]}
								stencilBuffer
								backgroundColor={backgroundColor}
								onSelect={handleSelectLetter}
							>
								<StencilSandbox scale={2} />
							</Letter>
							{FLOOR_AND_WALL_COLLIDERS.map((collider) => (
								<CuboidCollider
									key={collider.position.join(",")}
									position={collider.position}
									args={collider.args}
								/>
							))}
						</Physics>
						<Environment files={ENVIRONMENT_HDRI_URL} resolution={1024}>
							<group rotation={[-Math.PI / 3, 0, 0]}>
								<Lightformer
									intensity={4}
									rotation-x={Math.PI / 2}
									position={[0, 5, -9]}
									scale={[10, 10, 1]}
								/>
								{CIRCLE_LIGHTFORMERS.map((lightformer) => (
									<Lightformer
										key={lightformer.position.join(",")}
										form="circle"
										intensity={4}
										rotation={[Math.PI / 2, 0, 0]}
										position={lightformer.position}
										scale={[4, 1, 1]}
									/>
								))}
								<Lightformer
									intensity={2}
									rotation-y={Math.PI / 2}
									position={[-5, 1, -1]}
									scale={[50, 2, 1]}
								/>
								<Lightformer
									intensity={2}
									rotation-y={-Math.PI / 2}
									position={[10, 1, 0]}
									scale={[50, 2, 1]}
								/>
							</group>
						</Environment>
						<ContactShadows
							smooth={false}
							scale={100}
							position={[0, -5.05, 0]}
							blur={0.5}
							opacity={0.75}
						/>
						<CameraControls
							ref={setCameraControlsRef}
							makeDefault
							dollyToCursor
							minPolarAngle={0}
							maxPolarAngle={Math.PI / 2}
						/>
						<Preload all />
					</Canvas>
					{isFocused &&
						createPortal(
							<button
								type="button"
								onClick={handleClose}
								aria-label="Close letter view"
								className="fixed top-4 right-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/80 text-stone-700 shadow-lg backdrop-blur transition-colors hover:bg-white hover:text-stone-900"
							>
								<X className="size-5" />
							</button>,
							document.body,
						)}
				</>
			)}
		</ClientOnly>
	);
}

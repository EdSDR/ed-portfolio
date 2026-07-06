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
import { useEffect, useState } from "react";
import {
	CIRCLE_LIGHTFORMERS,
	ENVIRONMENT_HDRI_URL,
	FLOOR_AND_WALL_COLLIDERS,
	PORTAL_BACKGROUND_COLOR,
} from "#/components/portal-background/constants";
import { Letter } from "#/components/portal-background/letter";
import { BasicSandbox } from "#/components/portal-background/sandboxes/basic-sandbox";
import { PingPongSandbox } from "#/components/portal-background/sandboxes/ping-pong-sandbox";
import { RocketSandbox } from "#/components/portal-background/sandboxes/rocket-sandbox";
import { ShoeSandbox } from "#/components/portal-background/sandboxes/shoe-sandbox";
import { StencilSandbox } from "#/components/portal-background/sandboxes/stencil-sandbox";
import { TurtleSandbox } from "#/components/portal-background/sandboxes/turtle-sandbox";

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

	return (
		<ClientOnly>
			{isIdle && (
				<Canvas
					dpr={[1.5, 2]}
					camera={{ position: [-20, 40, 30], fov: 45, near: 1, far: 300 }}
				>
					<color attach="background" args={[PORTAL_BACKGROUND_COLOR]} />
					<Physics gravity={[0, -60, 0]}>
						<Letter char="P" position={[1, 50, -1]} rotation={[0, 0, 0]}>
							<TurtleSandbox />
						</Letter>
						<Letter char="M" position={[2, 60, -2]} rotation={[4, 5, 6]}>
							<ShoeSandbox scale={5} />
						</Letter>
						<Letter char="N" position={[3, 70, 2]} rotation={[7, 8, 9]}>
							<RocketSandbox position={[-1, -1, 0]} scale={0.6} />
						</Letter>
						<Letter char="D" position={[-1, 80, 3]} rotation={[10, 11, 12]}>
							<BasicSandbox scale={3} />
						</Letter>
						<Letter char="R" position={[-2, 90, 2]} rotation={[13, 14, 15]}>
							<PingPongSandbox />
						</Letter>
						<Letter
							char="S"
							position={[-3, 100, -3]}
							rotation={[16, 17, 18]}
							stencilBuffer
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
						makeDefault
						dollyToCursor
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>
					<Preload all />
				</Canvas>
			)}
		</ClientOnly>
	);
}

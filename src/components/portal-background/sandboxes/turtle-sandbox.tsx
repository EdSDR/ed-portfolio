import {
	Float,
	Instance,
	Instances,
	useAnimations,
	useGLTF,
} from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { TURTLE_MODEL_URL } from "#/components/portal-background/constants";

type SphereConfig = readonly [
	scale: number,
	color: string,
	speed: number,
	position: readonly [number, number, number],
];

const SPHERES: readonly SphereConfig[] = [
	[1, "orange", 0.05, [-4, -1, -1]],
	[0.75, "hotpink", 0.1, [-4, 2, -2]],
	[1.25, "aquamarine", 0.2, [4, -3, 2]],
	[1.5, "lightblue", 0.3, [-4, -2, -3]],
	[2, "pink", 0.3, [-4, 2, -4]],
	[2, "skyblue", 0.3, [-4, 2, -4]],
	[1.5, "orange", 0.05, [-4, -1, -1]],
	[2, "hotpink", 0.1, [-4, 2, -2]],
	[1.5, "aquamarine", 0.2, [4, -3, 2]],
	[1.25, "lightblue", 0.3, [-4, -2, -3]],
	[1, "pink", 0.3, [-4, 2, -4]],
	[1, "skyblue", 0.3, [-4, 2, -4]],
] as const satisfies readonly SphereConfig[];

// Author: DigitalLife3D (https://sketchfab.com/DigitalLife3D)
// License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
// Source: https://sketchfab.com/3d-models/model-52a-kemps-ridley-sea-turtle-no-id-7aba937dfbce480fb3aca47be3a9740b
// Title: Model 52A - Kemps Ridley Sea Turtle (no ID)
export function TurtleSandbox() {
	return (
		<Instances renderOrder={-1000}>
			<ambientLight intensity={0.3} onPointerOver={() => null} />
			<pointLight position={[10, 10, 5]} />
			<pointLight position={[-10, -10, -5]} />
			<sphereGeometry args={[1, 64, 64]} />
			<meshBasicMaterial depthTest={false} />
			{SPHERES.map(([scale, color, speed, position]) => (
				<Sphere
					key={`${scale}-${color}-${position.join(",")}`}
					scale={scale}
					color={color}
					speed={speed}
					position={position}
				/>
			))}
			<Float rotationIntensity={2} floatIntensity={10} speed={2}>
				<Turtle position={[0, 0, -2]} rotation={[0, Math.PI, 0]} scale={26} />
			</Float>
		</Instances>
	);
}

type SphereProps = {
	position: readonly [number, number, number];
	scale?: number;
	speed?: number;
	color?: string;
};

function Sphere({
	position,
	scale = 1,
	speed = 0.1,
	color = "white",
}: SphereProps) {
	return (
		<Float rotationIntensity={40} floatIntensity={20} speed={speed}>
			<Instance position={[...position]} scale={scale} color={color} />
		</Float>
	);
}

function Turtle(props: Omit<ThreeElements["primitive"], "object">) {
	const { scene, animations } = useGLTF(TURTLE_MODEL_URL);
	const { actions, mixer } = useAnimations(animations, scene);

	useEffect(() => {
		mixer.timeScale = 0.5;
		actions["Swim Cycle"]?.play();
	}, [actions, mixer]);

	useFrame((state) => {
		scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2;
	});

	return <primitive object={scene} {...props} />;
}

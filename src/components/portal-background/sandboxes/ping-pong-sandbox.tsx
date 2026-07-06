import type { ThreeElements } from "@react-three/fiber";
import { useFrame, useThree } from "@react-three/fiber";
import {
	CuboidCollider,
	Physics,
	type RapierRigidBody,
	RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { Euler, Quaternion } from "three";

const euler = new Euler();
const quaternion = new Quaternion();
const RESTITUTION = 2.2;

export function PingPongSandbox(props: ThreeElements["group"]) {
	return (
		<group {...props}>
			<ambientLight intensity={0.3} onPointerOver={() => null} />
			<pointLight position={[10, 10, 5]} />
			<pointLight position={[-10, -10, -5]} />
			<Physics gravity={[0, -30, 0]}>
				<Ball />
				<Paddle />
				<Enemy color="orange" position={[2.75, 1, 0]} />
				<Enemy color="skyblue" position={[-2.75, 3, 0]} />
			</Physics>
		</group>
	);
}

function Ball({ args = [0.75, 32, 32] }: { args?: [number, number, number] }) {
	const { viewport } = useThree();
	const ref = useRef<RapierRigidBody>(null);

	return (
		<>
			<RigidBody ref={ref} colliders="ball" mass={1}>
				<mesh>
					<sphereGeometry args={args} />
					<meshStandardMaterial />
				</mesh>
			</RigidBody>
			<RigidBody
				colliders={false}
				position={[0, -viewport.height, 0]}
				restitution={RESTITUTION}
				type="fixed"
				onCollisionEnter={() => {
					ref.current?.setTranslation({ x: 0, y: 0, z: 0 }, true);
					ref.current?.setLinvel({ x: 0, y: 10, z: 0 }, true);
				}}
			>
				<CuboidCollider args={[100, 2, 100]} />
			</RigidBody>
		</>
	);
}

function Paddle({ args = [4, 1, 1] }: { args?: [number, number, number] }) {
	const ref = useRef<RapierRigidBody>(null);

	useFrame((state) => {
		ref.current?.setTranslation(
			{ x: (state.pointer.x * state.viewport.width) / 2, y: -3.5, z: 0 },
			true,
		);
		ref.current?.setRotation(
			quaternion.setFromEuler(euler.set(0, 0, (state.pointer.x * Math.PI) / 5)),
			true,
		);
	});

	return (
		<RigidBody
			ref={ref}
			colliders="cuboid"
			type="fixed"
			restitution={RESTITUTION}
		>
			<mesh>
				<boxGeometry args={args} />
				<meshStandardMaterial color="hotpink" />
			</mesh>
		</RigidBody>
	);
}

type EnemyProps = {
	args?: [number, number, number];
	position: [number, number, number];
	color: string;
};

function Enemy({ args = [2.5, 1, 1], position, color }: EnemyProps) {
	return (
		<RigidBody
			colliders="cuboid"
			type="fixed"
			position={position}
			restitution={RESTITUTION}
		>
			<mesh>
				<boxGeometry args={args} />
				<meshStandardMaterial color={color} />
			</mesh>
		</RigidBody>
	);
}

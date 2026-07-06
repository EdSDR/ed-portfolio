import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";

export function BasicSandbox(props: ThreeElements["group"]) {
	return (
		<group {...props}>
			<ambientLight intensity={0.3} onPointerOver={() => null} />
			<pointLight position={[10, 10, 5]} />
			<pointLight position={[-10, -10, -5]} />
			<Box position={[-0.9, 0, 0]} />
			<Box position={[0.9, 0, 0]} />
		</group>
	);
}

function Box(props: ThreeElements["mesh"]) {
	const ref = useRef<Mesh>(null);
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	useFrame((_state, delta) => {
		if (ref.current) ref.current.rotation.x += delta;
	});

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <mesh> is a react-three-fiber element, not a DOM node
		<mesh
			{...props}
			ref={ref}
			scale={clicked ? 1.5 : 1}
			onClick={() => click(!clicked)}
			onPointerOver={() => hover(true)}
			onPointerOut={() => hover(false)}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
		</mesh>
	);
}

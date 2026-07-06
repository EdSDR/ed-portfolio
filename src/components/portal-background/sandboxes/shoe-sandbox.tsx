import { Environment, PivotControls, useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Material, Mesh } from "three";
import { SHOE_MODEL_URL } from "#/components/portal-background/constants";

type ShoeGltf = ReturnType<typeof useGLTF> & {
	nodes: Record<
		| "shoe"
		| "shoe_1"
		| "shoe_2"
		| "shoe_3"
		| "shoe_4"
		| "shoe_5"
		| "shoe_6"
		| "shoe_7",
		Mesh
	>;
	materials: Record<
		"laces" | "mesh" | "caps" | "inner" | "sole" | "stripes" | "band" | "patch",
		Material
	>;
};

export function ShoeSandbox(props: ThreeElements["group"]) {
	return (
		<group {...props}>
			<ambientLight intensity={0.2} />
			<spotLight
				intensity={0.5}
				angle={0.1}
				penumbra={1}
				position={[10, 15, 10]}
			/>
			<PivotControls depthTest={false} anchor={[0, 0, 0]}>
				<Shoe />
			</PivotControls>
			<Environment preset="city" />
		</group>
	);
}

function Shoe() {
	const ref = useRef<Group>(null);
	const { nodes, materials } = useGLTF(SHOE_MODEL_URL, true) as ShoeGltf;

	useFrame((state) => {
		if (!ref.current) return;
		const t = state.clock.getElapsedTime() * 2;
		ref.current.rotation.set(
			Math.cos(t / 4) / 8,
			Math.sin(t / 4) / 8,
			-0.2 - (1 + Math.sin(t / 1.5)) / 20,
		);
		ref.current.position.y = (1 + Math.sin(t / 4)) / 10;
	});

	return (
		<group ref={ref}>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe.geometry}
				material={materials.laces}
				material-color="white"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_1.geometry}
				material={materials.mesh}
				material-color="skyblue"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_2.geometry}
				material={materials.caps}
				material-color="skyblue"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_3.geometry}
				material={materials.inner}
				material-color="orange"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_4.geometry}
				material={materials.sole}
				material-color="white"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_5.geometry}
				material={materials.stripes}
				material-color="lightblue"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_6.geometry}
				material={materials.band}
				material-color="lightblue"
			/>
			<mesh
				receiveShadow
				castShadow
				geometry={nodes.shoe_7.geometry}
				material={materials.patch}
				material-color="orange"
			/>
		</group>
	);
}

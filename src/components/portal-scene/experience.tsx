import {
	Center,
	Sparkles,
	shaderMaterial,
	useGLTF,
	useTexture,
} from "@react-three/drei";
import { extend, type ThreeElement, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { portalFragmentShader, portalVertexShader } from "./shaders/portal";

const PortalMaterial = shaderMaterial(
	{
		uTime: 0,
		uColorStart: new THREE.Color("#000000"),
		uColorEnd: new THREE.Color("#ffffff"),
	},
	portalVertexShader,
	portalFragmentShader,
);

type PortalMaterialImpl = THREE.ShaderMaterial & {
	uTime: number;
	uColorStart: THREE.Color;
	uColorEnd: THREE.Color;
};

declare module "@react-three/fiber" {
	interface ThreeElements {
		portalMaterial: ThreeElement<typeof PortalMaterial>;
	}
}

extend({ PortalMaterial });

type PortalNodes = {
	baked: THREE.Mesh;
	poleLightA: THREE.Mesh;
	poleLightB: THREE.Mesh;
	portalLight: THREE.Mesh;
};

useGLTF.preload("/portal/portal.glb");

export function Experience() {
	const portalMaterialRef = useRef<PortalMaterialImpl>(null);
	const gltf = useGLTF("/portal/portal.glb");
	const nodes = gltf.nodes as unknown as PortalNodes;
	const bakedTexture = useTexture("/portal/baked.jpg", (texture) => {
		texture.flipY = false;
		texture.colorSpace = THREE.SRGBColorSpace;
	});

	useFrame((_, delta) => {
		if (portalMaterialRef.current) {
			portalMaterialRef.current.uTime += delta;
		}
	});

	return (
		<Center>
			<mesh geometry={nodes.baked.geometry}>
				<meshBasicMaterial map={bakedTexture} side={THREE.DoubleSide} />
			</mesh>

			<mesh
				geometry={nodes.poleLightA.geometry}
				position={nodes.poleLightA.position}
			>
				<meshBasicMaterial color="#ffffe5" />
			</mesh>

			<mesh
				geometry={nodes.poleLightB.geometry}
				position={nodes.poleLightB.position}
			>
				<meshBasicMaterial color="#ffffe5" />
			</mesh>

			<mesh
				geometry={nodes.portalLight.geometry}
				position={nodes.portalLight.position}
				rotation={nodes.portalLight.rotation}
			>
				<portalMaterial ref={portalMaterialRef} />
			</mesh>

			<Sparkles
				size={6}
				scale={[4, 2, 4]}
				position-y={1}
				speed={0.2}
				count={30}
			/>
		</Center>
	);
}

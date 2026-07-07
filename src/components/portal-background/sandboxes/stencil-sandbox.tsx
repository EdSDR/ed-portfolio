import {
	Float,
	Mask,
	PivotControls,
	RoundedBox,
	type RoundedBoxProps,
	useGLTF,
	useMask,
} from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { Suspense } from "react";
import type { Mesh } from "three";
import { REACT_MODEL_URL } from "#/components/portal-background/constants";

type StencilGltf = ReturnType<typeof useGLTF> & {
	nodes: Record<"atom", Mesh>;
};

export function StencilSandbox(props: ThreeElements["group"]) {
	return (
		<group {...props}>
			<directionalLight position={[1, 2, 1.5]} intensity={0.5} castShadow />
			<hemisphereLight intensity={1.5} groundColor="red" />
			<Suspense fallback={null}>
				<PivotControls
					scale={1.5}
					rotation={[0, 0, Math.PI]}
					offset={[0, 0, 1]}
					activeAxes={[true, true, false]}
					disableRotations
					depthTest={false}
				>
					<Frame position={[0, 0, 1]} />
					<Mask id={1} position={[0, 0, 0.95]}>
						<circleGeometry args={[1.5, 64]} />
					</Mask>
				</PivotControls>
				<Float floatIntensity={4} rotationIntensity={0} speed={4}>
					<Atom invert={false} scale={1.5} />
				</Float>
				<Box
					color="#EAC435"
					args={[1, 5, 1]}
					rotation-y={Math.PI / 4}
					position={[0, 0, -2]}
				/>
				<Box color="#03CEA4" args={[2, 2, 2]} position={[-2, 0, -2]} />
			</Suspense>
		</group>
	);
}

type BoxProps = RoundedBoxProps & { color?: string };

function Box({
	args = [1, 4, 1],
	radius = 0.05,
	smoothness = 4,
	color = "black",
	...boxProps
}: BoxProps) {
	return (
		<RoundedBox
			args={args}
			radius={radius}
			smoothness={smoothness}
			{...boxProps}
		>
			<meshPhongMaterial color={color} />
		</RoundedBox>
	);
}

function Frame(props: ThreeElements["mesh"]) {
	return (
		<mesh {...props}>
			<ringGeometry args={[1.35, 1.5, 64]} />
			<meshPhongMaterial color="black" />
		</mesh>
	);
}

function Atom({
	invert,
	...props
}: { invert: boolean } & ThreeElements["mesh"]) {
	const stencil = useMask(1, invert);
	const { nodes } = useGLTF(REACT_MODEL_URL) as StencilGltf;

	return (
		<mesh
			castShadow
			receiveShadow
			geometry={nodes.atom.geometry}
			{...props}
			dispose={null}
		>
			<meshPhongMaterial color="#33BBFF" {...stencil} />
		</mesh>
	);
}

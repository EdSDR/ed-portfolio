import {
	type CameraControlsImpl,
	Center,
	MeshTransmissionMaterial,
	Preload,
	RenderTexture,
	type RenderTextureProps,
	Text3D,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import type { Group } from "three";
import {
	BOLD_FONT_URL,
	PORTAL_BACKGROUND_COLOR,
} from "#/components/portal-background/constants";

type LetterProps = {
	char: string;
	position: [number, number, number];
	rotation: [number, number, number];
	stencilBuffer?: boolean;
	children: React.ReactNode;
};

export function Letter({
	char,
	children,
	stencilBuffer = false,
	...props
}: LetterProps) {
	const main = useRef<Group>(null);
	const contents = useRef<Group>(null);
	const events = useThree((state) => state.events);
	const controls = useThree(
		(state) => state.controls,
	) as CameraControlsImpl | null;

	useFrame(() => {
		if (!main.current || !contents.current) return;
		contents.current.matrix.copy(main.current.matrixWorld);
	});

	return (
		<RigidBody restitution={0.1} colliders="cuboid" {...props}>
			<Center ref={main}>
				<Text3D
					bevelEnabled
					onDoubleClick={(e) => {
						e.stopPropagation();
						if (main.current) controls?.fitToBox(main.current, true);
					}}
					font={BOLD_FONT_URL}
					smooth={1}
					scale={0.125}
					size={80}
					height={4}
					curveSegments={10}
					bevelThickness={10}
					bevelSize={2}
					bevelOffset={0}
					bevelSegments={5}
				>
					{char}
					<MeshTransmissionMaterial
						clearcoat={1}
						samples={3}
						thickness={40}
						chromaticAberration={0.25}
						anisotropy={0.4}
					>
						<RenderTexture
							attach="buffer"
							stencilBuffer={stencilBuffer}
							width={512}
							height={512}
							compute={events.compute as RenderTextureProps["compute"]}
						>
							<color attach="background" args={[PORTAL_BACKGROUND_COLOR]} />
							<group ref={contents} matrixAutoUpdate={false}>
								{children}
							</group>
							<Preload all />
						</RenderTexture>
					</MeshTransmissionMaterial>
				</Text3D>
			</Center>
		</RigidBody>
	);
}

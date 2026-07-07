import type { CameraControls } from "@react-three/drei";
import { monitor, useControls } from "leva";
import type { RefObject } from "react";
import { Vector3 } from "three";

type CameraDebugPanelProps = {
	controlsRef: RefObject<CameraControls | null>;
	defaultPosition: [number, number, number];
	defaultTarget: [number, number, number];
};

const scratchPosition = new Vector3();
const scratchTarget = new Vector3();

export function CameraDebugPanel({
	controlsRef,
	defaultPosition,
	defaultTarget,
}: CameraDebugPanelProps) {
	const [defaultPositionX, defaultPositionY, defaultPositionZ] =
		defaultPosition;
	const [defaultTargetX, defaultTargetY, defaultTargetZ] = defaultTarget;

	useControls("Camera / Set", {
		position: {
			value: { x: defaultPositionX, y: defaultPositionY, z: defaultPositionZ },
			step: 0.5,
			onChange: ({ x, y, z }: { x: number; y: number; z: number }) => {
				const controls = controlsRef.current;
				if (!controls) return;
				const target = controls.getTarget(scratchTarget);
				controls.setLookAt(x, y, z, target.x, target.y, target.z, true);
			},
		},
		target: {
			value: { x: defaultTargetX, y: defaultTargetY, z: defaultTargetZ },
			step: 0.5,
			onChange: ({ x, y, z }: { x: number; y: number; z: number }) => {
				const controls = controlsRef.current;
				if (!controls) return;
				const position = controls.getPosition(scratchPosition);
				controls.setLookAt(position.x, position.y, position.z, x, y, z, true);
			},
		},
		minPolarAngle: {
			value: 0,
			min: 0,
			max: Math.PI,
			onChange: (value: number) => {
				const controls = controlsRef.current;
				if (controls) controls.minPolarAngle = value;
			},
		},
		maxPolarAngle: {
			value: Math.PI / 2,
			min: 0,
			max: Math.PI,
			onChange: (value: number) => {
				const controls = controlsRef.current;
				if (controls) controls.maxPolarAngle = value;
			},
		},
	});

	useControls("Camera / Live", {
		position: monitor(() => {
			const p = controlsRef.current?.getPosition(scratchPosition);
			return p
				? `${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`
				: "–";
		}),
		target: monitor(() => {
			const t = controlsRef.current?.getTarget(scratchTarget);
			return t
				? `${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)}`
				: "–";
		}),
		azimuthAngle: monitor(
			() => controlsRef.current?.azimuthAngle.toFixed(3) ?? "–",
		),
		polarAngle: monitor(
			() => controlsRef.current?.polarAngle.toFixed(3) ?? "–",
		),
		distance: monitor(() => controlsRef.current?.distance.toFixed(2) ?? "–"),
	});

	return null;
}

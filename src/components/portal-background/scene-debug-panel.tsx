import { useControls } from "leva";

type SceneDebugPanelProps = {
	backgroundColor: string;
	onBackgroundColorChange: (color: string) => void;
};

export function SceneDebugPanel({
	backgroundColor,
	onBackgroundColorChange,
}: SceneDebugPanelProps) {
	useControls("Scene", {
		backgroundColor: {
			value: backgroundColor,
			onChange: onBackgroundColorChange,
		},
	});

	return null;
}

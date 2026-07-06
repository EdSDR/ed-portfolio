const PORTAL_ASSET_BASE = "/portal-background";

export const BOLD_FONT_URL = `${PORTAL_ASSET_BASE}/bold.blob`;
export const ROCKET_MODEL_URL = `${PORTAL_ASSET_BASE}/rocket-transformed.glb`;
export const SHOE_MODEL_URL = `${PORTAL_ASSET_BASE}/shoe-draco.glb`;
export const REACT_MODEL_URL = `${PORTAL_ASSET_BASE}/react-transformed.glb`;
export const TURTLE_MODEL_URL = `${PORTAL_ASSET_BASE}/turtle-transformed.glb`;

export const ENVIRONMENT_HDRI_URL =
	"https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr";

export const PORTAL_BACKGROUND_COLOR = "#4899c9";

type ColliderLayout = {
	position: [number, number, number];
	args: [number, number, number];
};

export const FLOOR_AND_WALL_COLLIDERS: readonly ColliderLayout[] = [
	{ position: [0, -6, 0], args: [100, 1, 100] },
	{ position: [0, 0, -30], args: [30, 100, 1] },
	{ position: [0, 0, 10], args: [30, 100, 1] },
	{ position: [-30, 0, 0], args: [1, 100, 30] },
	{ position: [30, 0, 0], args: [1, 100, 30] },
] as const satisfies readonly ColliderLayout[];

type CircleLightformerLayout = {
	position: [number, number, number];
};

export const CIRCLE_LIGHTFORMERS: readonly CircleLightformerLayout[] = (
	[2, 0, 2, 0, 2, 0, 2, 0] as const
).map((x, i) => ({ position: [x, 4, i * 4] }));

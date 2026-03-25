export function getPreviewUrl(item: {
	slug: string;
	image?: string;
}): string | null {
	if (item.image) {
		return `previews/${item.image}`;
	}

	return `previews/${item.slug}.png`;
}

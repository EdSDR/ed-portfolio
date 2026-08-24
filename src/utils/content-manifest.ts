const workFiles = import.meta.glob("/content/work/*.md", { query: "?url" });
const projectFiles = import.meta.glob("/content/projects/*.md", {
	query: "?url",
});

const WORK_SLUGS = new Set(
	Object.keys(workFiles).map((p) =>
		p.replace("/content/work/", "").replace(/\.md$/, ""),
	),
);
const PROJECT_SLUGS = new Set(
	Object.keys(projectFiles).map((p) =>
		p.replace("/content/projects/", "").replace(/\.md$/, ""),
	),
);

export function hasWorkContent(slug: string): boolean {
	return WORK_SLUGS.has(slug);
}

export function hasProjectContent(slug: string): boolean {
	return PROJECT_SLUGS.has(slug);
}

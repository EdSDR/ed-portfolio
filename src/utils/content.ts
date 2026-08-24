const workContent = import.meta.glob("/content/work/*.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const projectContent = import.meta.glob("/content/projects/*.md", {
	eager: true,
	query: "?raw",
	import: "default",
}) as Record<string, string>;

const WORK_CONTENT = new Map(
	Object.entries(workContent).map(([p, c]) => [
		p.replace("/content/work/", "").replace(/\.md$/, ""),
		c,
	]),
);

const PROJECT_CONTENT = new Map(
	Object.entries(projectContent).map(([p, c]) => [
		p.replace("/content/projects/", "").replace(/\.md$/, ""),
		c,
	]),
);

export function getWorkMarkdown(slug: string): string | undefined {
	return WORK_CONTENT.get(slug);
}

export function getProjectMarkdown(slug: string): string | undefined {
	return PROJECT_CONTENT.get(slug);
}

import {
	createFileRoute,
	Link,
	notFound,
	redirect,
} from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROJECTS } from "#/utils/constants";
import { getProjectMarkdown } from "#/utils/content";

export const Route = createFileRoute("/projects/$slug")({
	loader: ({ params }) => {
		const item = PROJECTS.find((p) => p.slug === params.slug);

		if (!item) {
			throw notFound();
		}

		const markdown = getProjectMarkdown(item.slug);

		if (markdown === undefined) {
			throw redirect({ href: item.url });
		}

		return { item, markdown };
	},
	component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
	const { item, markdown } = Route.useLoaderData();

	return (
		<article className="prose prose-site mx-auto max-w-2xl px-6 py-12">
			<Link to="/" className="not-prose text-sm">
				&larr; Back
			</Link>

			<h1>{item.name}</h1>
			<p className="not-prose text-sm text-[#44403C]">{item.role}</p>
			<a
				href={item.url}
				target="_blank"
				rel="noopener noreferrer"
				className="not-prose text-sm underline"
			>
				Visit site
			</a>

			<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
		</article>
	);
}

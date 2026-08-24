import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WORK_ITEMS } from "#/utils/constants";
import { getWorkMarkdown } from "#/utils/content";

export const Route = createFileRoute("/work/$slug")({
	loader: ({ params }) => {
		const item = WORK_ITEMS.find((w) => w.slug === params.slug);
		const markdown = item ? getWorkMarkdown(item.slug) : undefined;

		if (!item || markdown === undefined) {
			throw notFound();
		}

		return { item, markdown };
	},
	component: WorkDetailRoute,
});

function WorkDetailRoute() {
	const { item, markdown } = Route.useLoaderData();

	return (
		<article className="prose prose-site mx-auto max-w-2xl px-6 py-12">
			<Link to="/" className="not-prose text-sm">
				&larr; Back
			</Link>

			<h1 className="text xl">{item.company}</h1>
			<p className="not-prose text-sm text-[#44403C]">
				{item.role} · {item.date}
			</p>

			<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
		</article>
	);
}

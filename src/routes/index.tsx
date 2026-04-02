import { createFileRoute } from "@tanstack/react-router";
import {
	LayoutGroup,
	type MotionNodeAnimationOptions,
	motion,
	type Transition,
	useMotionValue,
	useMotionValueEvent,
	useSpring,
	useTransform,
} from "motion/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatedText } from "#/components/animated-text";
import { HoverPreview } from "#/components/hover-preview";
import { GitHubIcon, LinkedInIcon, XIcon } from "#/components/icons";
import { PROJECTS, SOCIALS, WORK_ITEMS } from "#/utils/constants";
import { getPreviewUrl } from "#/utils/get-preview-url";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

const NAME_WRAPPER_SPRING_CONFIG = {
	type: "spring",
	stiffness: 80,
	damping: 20,
} as const satisfies Transition;

const NAME_SPRING_CONFIG = {
	stiffness: 30,
	damping: 15,
	mass: 3,
} as const satisfies Transition;

const SOCIAL_ANIMATION = {
	initial: {
		opacity: 0,
		y: 5,
		filter: "blur(4px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
	},
	transition: {
		duration: 1,
		ease: [0.2, 0.65, 0.3, 0.9],
	},
} as const satisfies MotionNodeAnimationOptions;

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
	GitHub: <GitHubIcon />,
	X: <XIcon />,
	LinkedIn: <LinkedInIcon />,
};

const ANIMATION_STEPS = [
	{ font: "Redaction 100", weight: 700, size: 16 },
	{ font: "Redaction 10", weight: 400, size: 13 },
	{ font: "Redaction 70", weight: 700, size: 10 },
	{ font: "Redaction", weight: 400, size: 8 },
	{ font: "Redaction 35", weight: 700, size: 6.5 },
	{ font: "Redaction 100", weight: 400, size: 5.2 },
	{ font: "Redaction 20", weight: 400, size: 4.2 },
	{ font: "Playfair Display Variable", weight: 700, size: 3.75 },
] as const satisfies Array<{
	font: string;
	weight: number;
	size: number;
}>;

const STEP_INDICES = ANIMATION_STEPS.map((_, i) => i);
const STEP_SIZES = ANIMATION_STEPS.map((s) => s.size);
const LAST_STEP = ANIMATION_STEPS.length - 1;

function RouteComponent() {
	const ref = useRef<HTMLHeadingElement>(null);
	const progress = useMotionValue(0);
	const spring = useSpring(progress, NAME_SPRING_CONFIG);
	const [expanded, setExpanded] = useState(false);

	const fontSize = useTransform(spring, STEP_INDICES, STEP_SIZES);
	const fontSizeRem = useTransform(
		fontSize,
		(v) =>
			`clamp(${(v * 0.3).toFixed(2)}rem, ${(v * 3.5).toFixed(2)}vw, ${v}rem)`,
	);

	useMotionValueEvent(spring, "change", (v) => {
		if (!ref.current) {
			return;
		}

		const i = Math.max(0, Math.min(Math.round(v), LAST_STEP));
		ref.current.style.setProperty(
			"font-family",
			`"${ANIMATION_STEPS[i].font}"`,
			"important",
		);
		ref.current.style.setProperty(
			"font-weight",
			String(ANIMATION_STEPS[i].weight),
			"important",
		);

		if (v > LAST_STEP) {
			setExpanded(true);
		}
	});

	useEffect(() => {
		progress.set(LAST_STEP);
	}, [progress]);

	return (
		<motion.div className="flex flex-1 justify-center px-6 py-[15vh] overflow-y-auto overflow-hidden">
			<LayoutGroup>
				<motion.div
					layout
					className="relative flex flex-col items-start w-full md:w-auto max-w-md md:max-w-none"
					transition={NAME_WRAPPER_SPRING_CONFIG}
				>
					{/* {expanded ? <Spotify /> : null} */}
					<motion.h1
						layout
						ref={ref}
						className="font-bold whitespace-nowrap will-change-transform"
						style={{ fontSize: fontSizeRem }}
					>
						Ed Castro
					</motion.h1>

					{expanded ? (
						<>
							<AnimatedText text="software engineer & designer" element="p" />

							<div className="flex items-center gap-2 mt-1">
								{SOCIALS.map((social, i) => (
									<motion.a
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.label}
										className="text-stone-400 hover:text-stone-600 transition-colors"
										initial={SOCIAL_ANIMATION.initial}
										animate={SOCIAL_ANIMATION.animate}
										transition={{
											...SOCIAL_ANIMATION.transition,
											delay: 0.3 + i * 0.1,
										}}
									>
										{SOCIAL_ICONS[social.label]}
									</motion.a>
								))}
							</div>

							<Home />
						</>
					) : null}

					<noscript>
						<p>Software Engineer & designer</p>
						<nav>
							{SOCIALS.map((social) => (
								<a key={social.label} href={social.href}>
									{social.label}
								</a>
							))}
						</nav>

						<h2>Work</h2>
						{WORK_ITEMS.map((item) => (
							<div key={item.slug}>
								<a href={item.url}>
									<strong>{item.company}</strong> — {item.role}
								</a>
								<p>{item.about}</p>
								<span>{item.date}</span>
							</div>
						))}

						<h2>Projects</h2>
						{PROJECTS.map((project) => (
							<div key={project.slug}>
								<a href={project.url}>
									<strong>{project.name}</strong> — {project.role}
								</a>
								<p>{project.about}</p>
							</div>
						))}
					</noscript>
				</motion.div>
			</LayoutGroup>
		</motion.div>
	);
}

type HoverState = {
	id: string;
	rect: DOMRect;
	previewUrl: string;
} | null;

const ITEM_ANIMATION = {
	initial: {
		opacity: 0,
		y: 5,
		filter: "blur(4px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
	},
	transition: {
		duration: 1,
		ease: [0.2, 0.65, 0.3, 0.9],
	},
} as const satisfies MotionNodeAnimationOptions;

const ITEM_HOVER_TRANSITION = {
	type: "spring",
	stiffness: 400,
	damping: 30,
} as const satisfies Transition;

// precompute preview urls since items are static
const WORK_PREVIEW_URLS = new Map(
	WORK_ITEMS.map((item) => [item.slug, getPreviewUrl(item) ?? ""]),
);
const PROJECT_PREVIEW_URLS = new Map(
	PROJECTS.map((item) => [item.slug, getPreviewUrl(item) ?? ""]),
);

type ItemRowProps = {
	id: string;
	label: string;
	role: string;
	about: string;
	date?: string;
	url: string;
	isHovered: boolean;
	layoutId: string;
	delay: number;
	previewUrl: string;
	onHover: (id: string, previewUrl: string, rect: DOMRect) => void;
};

const ItemRow = memo(function ItemRow({
	id,
	label,
	role,
	about,
	date,
	url,
	isHovered,
	layoutId,
	delay,
	previewUrl,
	onHover,
}: ItemRowProps) {
	const handleMouseEnter = useCallback(
		(e: React.MouseEvent) => {
			onHover(id, previewUrl, e.currentTarget.getBoundingClientRect());
		},
		[onHover, id, previewUrl],
	);

	return (
		<a href={url} target="_blank" rel="noopener noreferrer">
			<motion.div
				className="relative flex flex-col items-start will-change-transform -mx-2 px-2 -my-1 py-1 text-left"
				initial={ITEM_ANIMATION.initial}
				animate={ITEM_ANIMATION.animate}
				transition={{
					...ITEM_ANIMATION.transition,
					delay,
				}}
				onMouseEnter={handleMouseEnter}
			>
				{isHovered ? (
					<motion.div
						layoutId={layoutId}
						className="absolute inset-0 bg-stone-300/30 border border-stone-300/50 rounded-md"
						transition={ITEM_HOVER_TRANSITION}
					/>
				) : null}

				<div className="relative flex items-baseline justify-between gap-2 sm:gap-8 w-full">
					<div className="flex items-baseline gap-2 min-w-0">
						<span className="font-bold text-stone-700 truncate">{label}</span>
						<span className="text-sm text-stone-500 hidden sm:inline">
							{role}
						</span>
					</div>
					{date ? (
						<span className="text-sm text-stone-400 whitespace-nowrap hidden sm:inline">
							{date}
						</span>
					) : null}
				</div>

				<span className="relative text-xs text-stone-500 sm:hidden">
					{role}
				</span>

				<span className="relative text-xs text-stone-600">{about}</span>
				<img src={previewUrl} alt="" className="hidden" fetchPriority="low" />
			</motion.div>
		</a>
	);
});

export default function Home() {
	const [hoveredWork, setHoveredWork] = useState<HoverState>(null);
	const [hoveredProject, setHoveredProject] = useState<HoverState>(null);

	const handleWorkHover = useCallback(
		(id: string, previewUrl: string, rect: DOMRect) => {
			setHoveredWork({ id, rect, previewUrl });
		},
		[],
	);

	const handleProjectHover = useCallback(
		(id: string, previewUrl: string, rect: DOMRect) => {
			setHoveredProject({ id, rect, previewUrl });
		},
		[],
	);

	const clearWorkHover = useCallback(() => setHoveredWork(null), []);
	const clearProjectHover = useCallback(() => setHoveredProject(null), []);

	return (
		<>
			<AnimatedText
				className="text-xl mt-4 font-bold font-serif"
				element="h2"
				text="work"
				artificialDelay={0.3}
			/>

			<div className="flex flex-col gap-3 mt-3" onMouseLeave={clearWorkHover}>
				{WORK_ITEMS.map((item, i) => (
					<ItemRow
						key={item.slug}
						id={item.company}
						label={item.company}
						role={item.role}
						about={item.about}
						date={item.date}
						url={item.url}
						isHovered={hoveredWork?.id === item.company}
						layoutId="work-hover"
						delay={0.5 + i * 0.15}
						previewUrl={WORK_PREVIEW_URLS.get(item.slug) ?? ""}
						onHover={handleWorkHover}
					/>
				))}
			</div>

			<AnimatedText
				className="text-xl mt-4 font-bold font-serif"
				element="h2"
				text="projects"
				artificialDelay={0.3}
			/>

			<button
				type="button"
				className="flex flex-col gap-3 mt-3"
				onMouseLeave={clearProjectHover}
			>
				{PROJECTS.map((project, i) => (
					<ItemRow
						key={project.slug}
						id={project.name}
						label={project.name}
						role={project.role}
						about={project.about}
						url={project.url}
						isHovered={hoveredProject?.id === project.name}
						layoutId="project-hover"
						delay={0.5 + i * 0.15}
						previewUrl={PROJECT_PREVIEW_URLS.get(project.slug) ?? ""}
						onHover={handleProjectHover}
					/>
				))}
			</button>

			<div className="hidden md:block">
				<HoverPreview
					previewUrl={
						hoveredWork?.previewUrl || hoveredProject?.previewUrl || null
					}
					anchorRect={hoveredWork?.rect || hoveredProject?.rect || null}
				/>
			</div>
		</>
	);
}

// TODO: probably replace with a light weight popover library or something, this currently doesnt do edge detection.

import {
	AnimatePresence,
	type MotionNodeAnimationOptions,
	motion,
} from "motion/react";
import { createPortal } from "react-dom";

const PREVIEW_TRANSITION = {
	initial: {
		opacity: 0,
		filter: "blur(4px)",
		x: -4,
	},
	animate: {
		opacity: 1,
		filter: "blur(0px)",
		x: 0,
	},
	transition: {
		type: "spring",
		stiffness: 400,
		damping: 30,
	},
} as const satisfies MotionNodeAnimationOptions;

export function HoverPreview({
	previewUrl,
	anchorRect,
}: {
	previewUrl: string | null;
	anchorRect: DOMRect | null;
}) {
	const isVisible = previewUrl !== null && anchorRect !== null;

	// Rendered into `document.body` via a portal so this `position: fixed`
	// box is never a descendant of an animated/transformed ancestor — a
	// `transform` on any ancestor turns it into the containing block for
	// fixed descendants, which breaks the top/left math and can extend the
	// page's scrollable area, producing a stray scrollbar mid-animation.
	return (
		<AnimatePresence>
			{isVisible
				? createPortal(
						<motion.div
							layoutId="hover-preview"
							className="w-96 fixed z-50 pointer-events-none overflow-hidden rounded-lg border border-stone-300/50 shadow-lg bg-stone-200"
							style={{
								top: anchorRect.top,
								left: anchorRect.right + 12,
								willChange: "transform, opacity, filter",
							}}
							initial={PREVIEW_TRANSITION.initial}
							animate={PREVIEW_TRANSITION.animate}
							exit={PREVIEW_TRANSITION.initial}
							transition={PREVIEW_TRANSITION}
						>
							<img
								key={previewUrl}
								src={previewUrl}
								alt=""
								className="w-full block aspect-16/9 object-cover"
							/>
						</motion.div>,
						document.body,
					)
				: null}
		</AnimatePresence>
	);
}

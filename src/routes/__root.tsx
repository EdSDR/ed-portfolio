import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { PORTAL_BACKGROUND_COLOR } from "#/components/portal-background/constants";
import { PortalBackground } from "#/components/portal-background/portal-background";
import {
	PortalFocusProvider,
	usePortalFocus,
} from "#/components/portal-background/portal-focus-context";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: <script> tags are safe here */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased wrap-anywhere">
				<PortalFocusProvider>
					<div
						className="fixed inset-0 z-0"
						style={{ backgroundColor: PORTAL_BACKGROUND_COLOR }}
					>
						<PortalBackground />
					</div>
					<PageContent>{children}</PageContent>
				</PortalFocusProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function PageContent({ children }: { children: React.ReactNode }) {
	const { isFocused } = usePortalFocus();

	return (
		<div
			className={`relative z-10 transition-opacity duration-500 ${
				isFocused ? "opacity-0 pointer-events-none" : "opacity-100"
			}`}
			inert={isFocused}
		>
			{children}
		</div>
	);
}

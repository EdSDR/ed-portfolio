export type WorkItem = {
	company: string;
	slug: string;
	role: string;
	date: string;
	about: string;
	url: string;
	image?: string;
};

export type Project = {
	name: string;
	slug: string;
	role: string;
	about: string;
	url: string;
	image?: string;
};

export type Social = {
	label: string;
	href: string;
};

export const SOCIALS: readonly Social[] = [
	{ label: "GitHub", href: "https://github.com/EdSDR" },
	{ label: "X", href: "https://x.com/EdTheFrontender" },
	{ label: "LinkedIn", href: "https://www.linkedin.com/in/edsdr/" },
];

export const WORK_ITEMS: readonly WorkItem[] = [
	{
		company: "Renlabs",
		slug: "renlabs",
		role: "senior software engineer",
		date: "jul 2024 — present",
		about:
			"web applications and tooling for a substrate-based blockchain within the polkadot ecosystem",
		url: "https://torus.network/portal",
	},
	{
		company: "Nitro Academy",
		slug: "nitro-academy",
		role: "senior software engineer",
		date: "feb 2024 — jul 2024",
		about: "core software platform serving 10,000+ active users across brazil",
		url: "https://www.nitro.academy/en",
	},
	{
		company: "FutureMe",
		slug: "futureme",
		role: "software engineer",
		date: "jan 2022 — jan 2024",
		about:
			"platform rewrite focused on performance, type safety, and ux improvements",
		url: "https://www.futureme.tech/",
	},
];

export const PROJECTS: readonly Project[] = [
	{
		name: "aifred",
		slug: "aifred",
		role: "Owner & Lead Web Developer",
		about: "AI-powered chatbot for the web",
		url: "https://aifred.com.br/",
	},
];

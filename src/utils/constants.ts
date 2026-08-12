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
		role: "Senior Web3 Developer & Designer",
		date: "jul 2024 — present",
		about:
			"Substrate-based blockchain where autonomous on-chain agents interact and emissions flows.",
		url: "https://torus.network/portal",
	},
	{
		company: "Nitro Academy",
		slug: "nitro-academy",
		role: "Senior Web Developer",
		date: "feb 2024 — jul 2024",
		about:
			"Complement traditional education with practical subjects and top-tier mentors",
		url: "https://www.nitro.academy/en",
	},
	{
		company: "FutureMe",
		slug: "futureme",
		role: "Senior Web Developer & Product Designer",
		date: "jan 2022 — jan 2024",
		about: "Self-directed, gamified career guidance solution.",
		url: "https://www.futureme.tech/",
	},
];

export const PROJECTS: readonly Project[] = [
	{
		name: "Determinate Intelligence",
		slug: "deti",
		role: "Senior Web Developer & Designer",
		about:
			"Build AI systems where correctness is enforced by machinery, not promised by a prompt.",
		url: "https://determinate.org/",
	},
	{
		name: "AIfred",
		slug: "aifred",
		role: "Web Developer",
		about: "AI powered virtual asistant",
		url: "https://aifred.com.br/",
	},
];

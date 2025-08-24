import type { SVGProps } from "react";

export function Eye(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-eye-icon lucide-eye"
			{...props}
		>
			<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

export function EyeClosed(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-eye-closed-icon lucide-eye-closed"
			{...props}
		>
			<path d="m15 18-.722-3.25" />
			<path d="M2 8a10.645 10.645 0 0 0 20 0" />
			<path d="m20 15-1.726-2.05" />
			<path d="m4 15 1.726-2.05" />
			<path d="m9 18 .722-3.25" />
		</svg>
	);
}

import type { SVGProps } from "react";

// checkron icons

// chevron first icon
export function ChevronFirst(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m17 18l-6-6l6-6M7 6v12"
			/>
		</svg>
	);
}

// chevron last icon
export function ChevronLast(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m7 18l6-6l-6-6m10 0v12"
			/>
		</svg>
	);
}

// chevron left icon
export function ChevronLeft(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m15 18l-6-6l6-6"
			/>
		</svg>
	);
}

// chevron right icon
export function ChevronRight(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m9 18l6-6l-6-6"
			/>
		</svg>
	);
}

// chevron up icon
export function ChevronUp(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			{/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
			<path
				fill="none"
				stroke="#888888"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m18 15l-6-6l-6 6"
			/>
		</svg>
	);
}

// chevron down icon
export function ChevronDown(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			{/* Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE */}
			<path
				fill="none"
				stroke="#888888"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="m6 9l6 6l6-6"
			/>
		</svg>
	);
}

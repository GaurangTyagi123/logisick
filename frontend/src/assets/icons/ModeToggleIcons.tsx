import type { SVGProps } from "react";

// assets for mode-theme toggle button

// sun/light mode icon
export function Sun(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<g
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			>
				<path
					strokeDasharray="2"
					strokeDashoffset="2"
					d="M12 19v1M19 12h1M12 5v-1M5 12h-1"
				>
					<animate
						fill="freeze"
						attributeName="d"
						begin="0.6s"
						dur="0.2s"
						values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.6s"
						dur="0.2s"
						values="2;0"
					/>
				</path>
				<path
					strokeDasharray="2"
					strokeDashoffset="2"
					d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"
				>
					<animate
						fill="freeze"
						attributeName="d"
						begin="0.8s"
						dur="0.2s"
						values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.8s"
						dur="0.2s"
						values="2;0"
					/>
				</path>
				<animateTransform
					attributeName="transform"
					dur="30s"
					repeatCount="indefinite"
					type="rotate"
					values="0 12 12;360 12 12"
				/>
			</g>
			<mask id="lineMdMoonAltToSunnyOutlineLoopTransition0">
				<circle cx="12" cy="12" r="12" fill="#fff" />
				<circle cx="12" cy="12" r="8">
					<animate
						fill="freeze"
						attributeName="r"
						dur="0.4s"
						values="8;4"
					/>
				</circle>
				<circle cx="18" cy="6" r="12" fill="#fff">
					<animate
						fill="freeze"
						attributeName="cx"
						dur="0.4s"
						values="18;22"
					/>
					<animate
						fill="freeze"
						attributeName="cy"
						dur="0.4s"
						values="6;2"
					/>
					<animate
						fill="freeze"
						attributeName="r"
						dur="0.4s"
						values="12;3"
					/>
				</circle>
				<circle cx="18" cy="6" r="10">
					<animate
						fill="freeze"
						attributeName="cx"
						dur="0.4s"
						values="18;22"
					/>
					<animate
						fill="freeze"
						attributeName="cy"
						dur="0.4s"
						values="6;2"
					/>
					<animate
						fill="freeze"
						attributeName="r"
						dur="0.4s"
						values="10;1"
					/>
				</circle>
			</mask>
			<circle
				cx="12"
				cy="12"
				r="10"
				mask="url(#lineMdMoonAltToSunnyOutlineLoopTransition0)"
				fill="currentColor"
			>
				<animate
					fill="freeze"
					attributeName="r"
					dur="0.4s"
					values="10;6"
				/>
			</circle>
		</svg>
	);
}

// moon/dark mode icon
export function Moon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			{/* Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt */}
			<g
				fill="none"
				stroke="currentColor"
				strokeDasharray="4"
				strokeDashoffset="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5">
					<animate
						id="lineMdMoonRisingAltLoop0"
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="0.7s;lineMdMoonRisingAltLoop0.begin+6s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop0.begin+2s;lineMdMoonRisingAltLoop0.begin+4s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop0.begin+1.2s;lineMdMoonRisingAltLoop0.begin+3.2s;lineMdMoonRisingAltLoop0.begin+5.2s"
						dur="0.4s"
						values="0;4"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop0.begin+1.8s"
						to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop0.begin+3.8s"
						to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop0.begin+5.8s"
						to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"
					/>
				</path>
				<path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5">
					<animate
						id="lineMdMoonRisingAltLoop1"
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="1.1s;lineMdMoonRisingAltLoop1.begin+6s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop1.begin+2s;lineMdMoonRisingAltLoop1.begin+4s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop1.begin+1.2s;lineMdMoonRisingAltLoop1.begin+3.2s;lineMdMoonRisingAltLoop1.begin+5.2s"
						dur="0.4s"
						values="0;4"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop1.begin+1.8s"
						to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop1.begin+3.8s"
						to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop1.begin+5.8s"
						to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"
					/>
				</path>
				<path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5">
					<animate
						id="lineMdMoonRisingAltLoop2"
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="2s;lineMdMoonRisingAltLoop2.begin+6s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop2.begin+2s"
						dur="0.4s"
						values="4;0"
					/>
					<animate
						fill="freeze"
						attributeName="stroke-dashoffset"
						begin="lineMdMoonRisingAltLoop2.begin+1.2s;lineMdMoonRisingAltLoop2.begin+3.2s"
						dur="0.4s"
						values="0;4"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop2.begin+1.8s"
						to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"
					/>
					<set
						fill="freeze"
						attributeName="d"
						begin="lineMdMoonRisingAltLoop2.begin+5.8s"
						to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"
					/>
				</path>
			</g>
			<path
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
				transform="translate(0 22)"
			>
				<animateMotion
					fill="freeze"
					calcMode="linear"
					dur="0.6s"
					path="M0 0v-22"
				/>
			</path>
		</svg>
	);
}

// system/default mode icon
export function System(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			{/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
			<path
				fill="currentColor"
				d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h15q.425 0 .713.288T20 5t-.288.713T19 6H4v12h2q.425 0 .713.288T7 19t-.288.713T6 20zm7-2.5q.625 0 1.063-.437T12.5 16t-.437-1.062T11 14.5t-1.062.438T9.5 16t.438 1.063T11 17.5M21 20h-5q-.425 0-.712-.288T15 19v-9q0-.425.288-.712T16 9h5q.425 0 .713.288T22 10v9q0 .425-.288.713T21 20M9 19v-.775q-.475-.425-.737-1T8 16t.263-1.225t.737-1V13q0-.425.288-.712T10 12h2q.425 0 .713.288T13 13v.775q.475.425.738 1T14 16t-.262 1.225t-.738 1V19q0 .425-.288.713T12 20h-2q-.425 0-.712-.288T9 19"
			/>
		</svg>
	);
}

import clsx from "clsx";

interface LoadingProps {
	className?: string;
}

function Loading({ className }: LoadingProps) {
	return (
		<div className={clsx("flex items-center gap-2 h-screen w-screen", className)}>
			<div className="flex space-x-1 justify-center w-full">
				<div
					className="rounded-full bg-black animate-bounce w-8 h-8"
					style={{ animationDelay: "0ms" }}
				/>
				<div
					className="rounded-full bg-black animate-bounce w-8 h-8"
					style={{ animationDelay: "150ms" }}
				/>
				<div
					className="rounded-full bg-black animate-bounce w-8 h-8"
					style={{ animationDelay: "300ms" }}
				/>
			</div>
		</div>
	);
}

export default Loading;

import clsx from "clsx";
import useModeStore from "@/stores/useModeStore";

interface LoadingProps {
	className?: string;
}

function Loading({ className }: LoadingProps) {
	const isDark = useModeStore().getTheme() === "dark";
	return (
		<div
			className={clsx(
				"flex items-center gap-2 h-screen w-screen",
				className
			)}
		>
			<div className="flex space-x-1 justify-center w-full">
				<div
					className={clsx(
						"rounded-full animate-bounce w-8 h-8",
						isDark ? "bg-white" : "bg-zinc-900"
					)}
					style={{ animationDelay: "0ms" }}
				/>
				<div
					className={clsx(
						"rounded-full animate-bounce w-8 h-8",
						isDark ? "bg-white" : "bg-zinc-900"
					)}
					style={{ animationDelay: "150ms" }}
				/>
				<div
					className={clsx(
						"rounded-full animate-bounce w-8 h-8",
						isDark ? "bg-white" : "bg-zinc-900"
					)}
					style={{ animationDelay: "300ms" }}
				/>
			</div>
		</div>
	);
}

export default Loading;

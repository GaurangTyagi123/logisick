import clsx from "clsx";

interface LoadingProps {
	className?: string;
	fullscreen?: boolean;
}

/**
 * @component a aninated loading component to use as a placeholder when other compoennts are loading
 * @param {string} className extra classes added at parent component at whihc it is used
 * @author `Ravish Ranjan`
 */
function Loading({ className, fullscreen }: LoadingProps) {
	return (
		<div
			className={clsx(
				"flex items-center gap-2 h-full w-full bg-ls-bg-300 dark:bg-ls-bg-dark-900",
				fullscreen ? "h-screen w-screen" : "w-full h-full",
				className
			)}
		>
			<div className="flex space-x-1 justify-center w-full">
				<div
					className="rounded-full animate-bounce w-8 h-8 bg-zinc-900 dark:bg-white"
					style={{ animationDelay: "0ms" }}
				/>
				<div
					className="rounded-full animate-bounce w-8 h-8 bg-zinc-900 dark:bg-white"
					style={{ animationDelay: "150ms" }}
				/>
				<div
					className="rounded-full animate-bounce w-8 h-8 bg-zinc-900 dark:bg-white"
					style={{ animationDelay: "300ms" }}
				/>
			</div>
		</div>
	);
}

export default Loading;

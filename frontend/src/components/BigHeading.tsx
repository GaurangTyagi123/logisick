import clsx from "clsx";

/**
 * @component a component for big heading of the project name
 * @returns a component for use
 */
function BigHeading({ small }: { small?: boolean }) {
	return (
		<h1
			className={clsx(
				"select-none text-6xl ml-0 king-julian md:ml-15 text-black dark:text-white",
				small ? "ms:text-6xl" : "md:text-9xl "
			)}
		>
			LOG/SICK
		</h1>
	);
}

export default BigHeading;

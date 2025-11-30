import clsx from "clsx";

/**
 * @component a component for big heading of the project name
 * @author `Manas More`
 */
function BigHeading({ small, center }: { small?: boolean; center?: boolean }) {
	return (
		<h1
			className={clsx(
				"select-none text-6xl ml-0 king-julian text-black dark:text-white",
				small ? "ms:text-6xl" : "md:text-9xl ",
				center ? "" : "md:ml-15"
			)}
		>
			LOG/SICK
		</h1>
	);
}

export default BigHeading;

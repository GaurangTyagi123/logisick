import clsx from "clsx";
import { H3 } from "@/components/ui/Typography";

interface DocSecProps {
	children: React.ReactNode;
	id: string;
	title: string;
}

/**
 * @component a component to have the preset styling of a ducment section of documentation page
 * @param {ReactNode} children children component/node to put in the document section
 * @param {string} id id of the component so that it can be reached by anchor tag
 * @param {string} title title to give to the section
 * @author `Ravish Ranjan`
 */
function DocSec({ children, id, title }: DocSecProps) {
	return (
		<div
			id={id}
			className={clsx(
				"min-h-96 rounded-2xl overflow-y-auto p-4 relative bg-ls-bg-300 dark:bg-ls-bg-dark-800 scrollbar"
			)}
		>
			{/* overlay */}

			<div className="flex justify-between items-center sticky -top-5 bg-inherit ">
				<H3>{title}</H3>
			</div>
			{children}
		</div>
	);
}

export default DocSec;

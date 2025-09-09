interface DocSecProps {
	children: React.ReactNode;
	id: string;
}

/**
 * @component a component to have the preset styling of a ducment section of documentation page
 * @param children children component/node to put in the document section 
 * @param id id of the component so that it can be reached by anchor tag
 * @returns 
 */
function DocSec({ children, id }: DocSecProps) {
	return <div id={id} className="ml-4 min-h-50">{children}</div>;
}

export default DocSec;

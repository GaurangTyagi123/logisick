interface DocSecProps {
	children: React.ReactNode;
	id: string;
}

function DocSec({ children, id }: DocSecProps) {
	return <div id={id} className="ml-4 min-h-50">{children}</div>;
}

export default DocSec;

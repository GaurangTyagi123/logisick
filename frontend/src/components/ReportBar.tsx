import type { ReportType } from "@/services/apiItem";
import clsx from "clsx";
import { Badge } from "./ui/badge";

function ReportBar({
	name,
	value,
	suffix,
	prefix,
	variant,
	className,
}: {
	name: string;
	value: ReportType[keyof ReportType];
	suffix?: string;
	className?: string;
	prefix?: string;
	variant?:
		| "default"
		| "secondary"
		| "teritiary"
		| "destructive"
		| "outline"
		| null
		| undefined;
}) {
	return (
		<div
			className={clsx(
				"flex gap-2 justify-between items-center outline-1 p-2 rounded-xl w-full jet-brains",
				className
			)}
		>
			<span className="text-sm">{name}</span>
			<div>
				<Badge variant={variant} className="font-bold text-md">
					{suffix}
					{value}
					{prefix}
				</Badge>
			</div>
		</div>
	);
}
export default ReportBar;

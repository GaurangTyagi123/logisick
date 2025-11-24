import type { ReportType } from "@/services/apiItem";
import clsx from "clsx";
import { Badge } from "./ui/badge";
import { formatCurrency } from "@/utils/utilfn";

function ReportBar({
	name,
	value,
	suffix,
	currency = false,
	variant,
	className,
}: {
	name: string;
	value: ReportType[keyof ReportType];
	suffix?: string;
	className?: string;
	currency?: boolean;
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
				"flex gap-2 justify-between items-center outline-0 sm:outline-1 p-1 sm:p-2 rounded-xl w-full jet-brains",
				className
			)}
		>
			<span className="text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
				{name}
			</span>
			<div>
				<Badge
					variant={variant}
					className="font-bold text-xs md:text-sm md:text-md overflow-hidden text-ellipsis whitespace-nowrap"
				>
					{currency
						? formatCurrency(value, suffix as string)
						: value.toFixed(2)}
				</Badge>
			</div>
		</div>
	);
}
export default ReportBar;

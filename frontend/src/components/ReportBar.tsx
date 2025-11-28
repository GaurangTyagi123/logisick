import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/utilfn";

/**
 * @component component to be used as bar to display data of report 
 * @param {string} name name of report
 * @param {ReportType[keyof ReportType]} value value of report
 * @param {string} suffix suffix to add after value
 * @param {boolean} currency boolean value to tell if the data is curreny type or not
 * @param {string} variant variant of report bar's value badge
 * @param {string} className extra classname to be added in the report bar
 * @author `Ravish Ranjan`
 */
function ReportBar<ReportType>({
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
						? typeof value === "number"
							? formatCurrency(value, suffix as string)
							: typeof value === "number"
							? value.toFixed(2)
							: String(value)
						: String(value)}
				</Badge>
			</div>
		</div>
	);
}
export default ReportBar;

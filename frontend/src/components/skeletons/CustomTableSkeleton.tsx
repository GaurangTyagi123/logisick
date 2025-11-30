import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @componenet react componenet to be used as fallback of custom table
 * @author `Ravish Ranjan`
 */
function CustomTableSkeleton() {
	return (
		<div className="outline-1 rounded-2xl min-h-96 w-full">
			<div className="flex justify-between items-center p-4 h-22">
				<Skeleton className="w-1/3 h-8" />
				<div className="w-1/2 flex justify-end gap-1">
					<Skeleton className="w-1/2 h-10" />
					<Skeleton className="w-1/3 h-10" />
					<Skeleton className="w-10 h-10" />
				</div>
			</div>
			<Separator className="mb-2" />
			<div className="grid p-6 gap-1">
				<div className="grid grid-cols-3 mb-2">
					<Skeleton className="w-20 h-5" />
					<Skeleton className="w-20 h-5" />
					<Skeleton className="w-20 h-5" />
				</div>
				<Separator />
				<div className="flex gap-1">
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
				</div>
				<Separator />
                <div className="flex gap-1">
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
				</div>
				<Separator />
                <div className="flex gap-1">
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
				</div>
				<Separator />
                <div className="flex gap-1">
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
					<Skeleton className="w-full h-14" />
				</div>
				<div className="flex justify-center gap-1">
                    <Skeleton className="w-10 h-10"/>
                    <Skeleton className="w-10 h-10"/>
                    <Skeleton className="w-10 h-10"/>
                    <Skeleton className="w-10 h-10"/>
                    <Skeleton className="w-10 h-10"/>
                </div>
			</div>
		</div>
	);
}

export default CustomTableSkeleton;

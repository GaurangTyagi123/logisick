import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * @componenet react componenet to be used as fallback of profile table
 * @author `Ravish Ranjan`
 */
function ProfileTableSkeleton() {
	return (
		<>
			<TableHeader>
				<TableRow>
					<TableHead>Organization</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Subscription</TableHead>
					<TableHead>Members</TableHead>
					<TableHead>Type</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[1, 2, 3, 4, 5].map((_, i) => (
					<TableRow key={i}>
						<TableCell>
							<Skeleton className="h-10" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-10" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-10" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-10" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-10" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</>
	);
}

export default ProfileTableSkeleton;

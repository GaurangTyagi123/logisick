import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
} from "@/assets/icons/Pagination";
import Button from "./ui/button";
import type { ReactNode } from "react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	handlePageClick: (pageno: number) => void;
}

function Pagination({
	handlePageClick,
	currentPage,
	totalPages,
}: PaginationProps) {
	const renderPageButtons = () => {
		const buttons: ReactNode[] = [];

		// Helper function to add button
		const addButton = (pageNum: number) => {
			buttons.push(
				<Button
					key={pageNum}
					variant={currentPage === pageNum ? "default" : "outline"}
					onClick={() => handlePageClick(pageNum)}
					className="mx-1"
				>
					{pageNum}
				</Button>
			);
		};

		// Helper function to add ellipsis
		const addEllipsis = (key: string) => {
			buttons.push(
				<span key={key} className="mx-2">
					...
				</span>
			);
		};

		// Always show first page
		addButton(1);

		if (totalPages <= 5) {
			// If total pages is 5 or less, show all pages
			for (let i = 2; i <= totalPages; i++) {
				addButton(i);
			}
		} else {
			// For more than 5 pages, implement smart pagination
			if (currentPage <= 3) {
				// Near the start
				addButton(2);
				addButton(3);
				addButton(4);
				addEllipsis("ellipsis-end");
				addButton(totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near the end
				addEllipsis("ellipsis-start");
				addButton(totalPages - 3);
				addButton(totalPages - 2);
				addButton(totalPages - 1);
				addButton(totalPages);
			} else {
				// Somewhere in the middle
				addEllipsis("ellipsis-start");
				addButton(currentPage - 1);
				addButton(currentPage);
				addButton(currentPage + 1);
				addEllipsis("ellipsis-end");
				addButton(totalPages);
			}
		}

		return buttons;
	};

	return (
		<div className="flex items-center justify-center mt-4 space-x-2">
			<Button
				onClick={() => handlePageClick(1)}
				disabled={currentPage === 1}
				variant="outline"
			>
				<ChevronFirst />
			</Button>
			<Button
				onClick={() => handlePageClick(currentPage - 1)}
				disabled={currentPage == 1}
				variant="outline"
			>
				<ChevronLeft />
			</Button>
			{renderPageButtons()}
			<Button
				onClick={() => handlePageClick(currentPage + 1)}
				disabled={currentPage === totalPages}
				variant="outline"
			>
				<ChevronRight />
			</Button>
			<Button
				onClick={() => handlePageClick(totalPages ?? 1)}
				disabled={currentPage === totalPages}
				variant="outline"
			>
				<ChevronLast />
			</Button>
		</div>
	);
}

export default Pagination;

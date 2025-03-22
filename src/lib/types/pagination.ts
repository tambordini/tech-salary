export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	isMobile: boolean;
	onPrevPage: () => void;
	onNextPage: () => void;
	onGoToPage: (page: number) => void;
}

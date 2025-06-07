<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
	export let totalItems: number;
	export let itemsPerPage: number;
	export let isMobile: boolean;
	export let onPrevPage: () => void;
	export let onNextPage: () => void;
	export let onGoToPage: (page: number) => void;

	function generatePageNumbers(
		current: number,
		total: number,
		isMobile: boolean
	): (number | string)[] {
		const pages: (number | string)[] = [];
		const delta = isMobile ? 1 : 2;

		for (let i = 1; i <= total; i++) {
			if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
				pages.push(i);
			} else if ((i === current - delta - 1 && i > 1) || (i === current + delta + 1 && i < total)) {
				pages.push('...');
			}
		}

		return [...new Set(pages)];
	}

	$: pageNumbers = generatePageNumbers(currentPage, totalPages, isMobile);
	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);
</script>

<div class="flex flex-col items-center justify-between gap-2 px-2 sm:flex-row sm:gap-4 sm:px-4">
	<div class="text-xs text-gray-700 sm:text-sm {isMobile ? 'hidden' : ''}">
		Showing {startItem} to {endItem} of {totalItems} entries
	</div>

	<div class="flex items-center gap-1 sm:gap-2">
		<button
			on:click={onPrevPage}
			disabled={currentPage === 1}
			class="rounded-lg border px-2 py-1 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm {currentPage ===
			1
				? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
				: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
			aria-label="Previous page"
		>
			{isMobile ? '‹' : '←'}
		</button>

		{#each pageNumbers as page}
			{#if typeof page === 'string'}
				<span class="px-2 py-1 text-xs text-gray-700 sm:px-4 sm:py-2 sm:text-sm">{page}</span>
			{:else}
				<button
					on:click={() => onGoToPage(page)}
					class="rounded-lg border px-2 py-1 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm {currentPage ===
					page
						? 'border-[#0056a9] bg-[#0056a9] text-white'
						: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			on:click={onNextPage}
			disabled={currentPage === totalPages}
			class="rounded-lg border px-2 py-1 text-xs font-medium transition-colors duration-200 sm:px-4 sm:py-2 sm:text-sm {currentPage ===
			totalPages
				? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
				: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
			aria-label="Next page"
		>
			{isMobile ? '›' : '→'}
		</button>
	</div>
</div>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

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
		<Button
			on:click={onPrevPage}
			disabled={currentPage === 1}
			variant="outline"
			size="sm"
			class="h-8 w-8 p-0 sm:h-10 sm:w-10"
		>
			<ChevronLeft class="h-4 w-4" />
			<span class="sr-only">Previous page</span>
		</Button>

		{#each pageNumbers as page}
			{#if typeof page === 'string'}
				<span class="px-2 py-1 text-xs text-gray-700 sm:px-4 sm:py-2 sm:text-sm">{page}</span>
			{:else}
				<Button
					on:click={() => onGoToPage(page)}
					variant={currentPage === page ? 'default' : 'outline'}
					size="sm"
					class="h-8 w-8 p-0 text-xs sm:h-10 sm:w-10 sm:text-sm"
				>
					{page}
				</Button>
			{/if}
		{/each}

		<Button
			on:click={onNextPage}
			disabled={currentPage === totalPages}
			variant="outline"
			size="sm"
			class="h-8 w-8 p-0 sm:h-10 sm:w-10"
		>
			<ChevronRight class="h-4 w-4" />
			<span class="sr-only">Next page</span>
		</Button>
	</div>
</div>

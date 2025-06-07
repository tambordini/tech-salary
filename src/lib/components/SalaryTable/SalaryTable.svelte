<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { TableHeader as ShadcnTableHeader, Table, TableBody } from '$lib/components/ui/table';
	import { useSort } from '$lib/composables/useSort';
	import type { CompanySalary } from '$lib/types/salary';
	import { applyFilters, calculateTotalPages, paginateData } from '$lib/utils/tableUtils';
	import Pagination from './Pagination.svelte';
	import TableFilters from './TableFilters.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';

	export let salaryData: CompanySalary[];

	const itemsPerPage = 10;
	let currentPage = 1;
	let maxHeight = '60vh';

	const sortStore = useSort();

	let filters = {
		company: '',
		level: '',
		tag: ''
	};

	function onSort(column: keyof CompanySalary | 'totalCompensation') {
		console.log(`Sorting by ${column}`);
		sortStore.toggle(column);
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	let isMobile: boolean;

	function checkMobile() {
		isMobile = window.innerWidth < 640;
		maxHeight = isMobile ? '50vh' : '60vh';
	}

	function goToPage(page: number) {
		currentPage = page;
	}

	$: filteredData = applyFilters(salaryData, filters);
	$: sortedSalaryData = sortStore.sortData(filteredData, $sortStore);
	$: totalPages = calculateTotalPages(sortedSalaryData.length, itemsPerPage);
	$: paginatedData = paginateData(sortedSalaryData, currentPage, itemsPerPage);
</script>

<svelte:window on:resize={checkMobile} />

<div>
	<TableFilters bind:filters />
	<Card class="overflow-hidden">
		<div class="overflow-y-auto" style="max-height: {maxHeight};">
			<Table class="w-full table-fixed border-collapse">
				<ShadcnTableHeader class="sticky top-0 z-10 border-b bg-background">
					<TableHeader sortState={$sortStore} {onSort} />
				</ShadcnTableHeader>
				<TableBody>
					{#each paginatedData as rowData, i}
						<TableRow {rowData} index={i} />
					{/each}
				</TableBody>
			</Table>
		</div>

		<div class="sticky bottom-0 border-t bg-background px-4 py-2">
			<Pagination
				{currentPage}
				{totalPages}
				totalItems={sortedSalaryData.length}
				{itemsPerPage}
				{isMobile}
				onPrevPage={prevPage}
				onNextPage={nextPage}
				onGoToPage={goToPage}
			/>
		</div>
	</Card>
</div>

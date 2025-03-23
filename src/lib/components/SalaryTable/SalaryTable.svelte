<script lang="ts">
	import type { CompanySalary } from '$lib/types/salary';
	import { applyFilters, calculateTotalPages, paginateData, sortData } from '$lib/utils/tableUtils';
	import Pagination from './Pagination.svelte';
	import TableFilters from './TableFilters.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';

	export let salaryData: CompanySalary[];

	const itemsPerPage = 5;
	let currentPage = 1;

	let sortColumn: keyof CompanySalary | 'totalCompensation' = 'company';
	let sortDirection: 'asc' | 'desc' | 'none' = 'asc';

	let filters = {
		company: '',
		level: '',
		tag: ''
	};

	function onSort(column: keyof CompanySalary | 'totalCompensation') {
		if (sortColumn === column) {
			if (sortDirection === 'asc') {
				sortDirection = 'desc';
			} else if (sortDirection === 'desc') {
				sortDirection = 'none';
			} else {
				sortDirection = 'asc';
			}
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
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
	}

	function goToPage(page: number) {
		currentPage = page;
	}

	$: filteredData = applyFilters(salaryData, filters);
	$: sortedSalaryData = sortData(filteredData, sortColumn, sortDirection);
	$: totalPages = calculateTotalPages(sortedSalaryData.length, itemsPerPage);
	$: paginatedData = paginateData(sortedSalaryData, currentPage, itemsPerPage);
</script>

<svelte:window on:resize={checkMobile} />

<div class="container mx-auto p-2 sm:p-4">
	<TableFilters bind:filters />
	<div class="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
		<table class="min-w-full bg-white text-sm sm:text-base">
			<thead>
				<TableHeader {onSort} {sortColumn} {sortDirection} />
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each paginatedData as rowData, i}
					<TableRow {rowData} index={i} />
				{/each}
			</tbody>
		</table>
	</div>

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

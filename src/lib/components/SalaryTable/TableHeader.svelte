<script lang="ts">
	import type { CompanySalary } from '$lib/types/salary';

	export let sortColumn: string;
	export let sortDirection: 'asc' | 'desc' | 'none' = 'asc';
	export let onSort: (column: keyof CompanySalary | 'totalCompensation') => void;

	export const columns = [
		{ label: 'Company', column: 'company', align: 'left', hidden: false },
		{ label: 'Level', column: 'level', align: 'left', hidden: false },
		{ label: 'Tag', column: 'tag', align: 'left', hidden: false },
		{ label: 'Experience', column: 'experience', align: 'left', hidden: false },
		{ label: 'Total Compensation', column: 'totalCompensation', align: 'left', hidden: false },
		{ label: 'Base Salary', column: 'salary', align: 'right', hidden: false },
		{ label: 'Monthly Stock', column: 'stock', align: 'right', hidden: true },
		{ label: 'Bonus', column: 'bonus', align: 'right', hidden: true }
	] as const;
</script>

<tr class="bg-gradient-to-r from-[#0056a9] to-[#0066cc] text-white">
	{#each columns as { label, column, align, hidden }}
		<th
			class="cursor-pointer px-3 py-3 text-{align
				? align
				: 'left'} text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm
	{hidden ? 'hidden sm:table-cell' : ''}"
			on:click={() => onSort(column)}
		>
			<div class="flex items-center {align === 'right' ? 'justify-end' : ''} gap-1">
				{label}
				{#if sortColumn === column}
					<span class="text-base">
						{sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : ''}
					</span>
				{/if}
			</div>
		</th>
	{/each}
</tr>

<script lang="ts">
	import type { CompanySalary } from "$lib/types/salary";

	export let sortColumn: string;
	export let sortDirection: 'asc' | 'desc';
	export let onSort: (column: keyof CompanySalary | 'totalCompensation') => void;
</script>

<tr class="bg-gradient-to-r from-[#0056a9] to-[#0066cc] text-white">
	<th
		class="cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('company')}
	>
		<div class="flex items-center gap-1">
			Company
			{#if sortColumn === 'company'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('level')}
	>
		<div class="flex items-center gap-1">
			Level
			{#if sortColumn === 'level'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('tag')}
	>
		<div class="flex items-center gap-1">
			Tag
			{#if sortColumn === 'tag'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('experience')}
	>
		<div class="flex items-center gap-1">
			Experience
			{#if sortColumn === 'experience'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="cursor-pointer px-3 py-3 text-left text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('totalCompensation')}
	>
		<div class="flex items-center gap-1">
			Total Compensation
			{#if sortColumn === 'totalCompensation'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="cursor-pointer px-3 py-3 text-right text-xs font-semibold tracking-wider sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('salary')}
	>
		<div class="flex items-center justify-end gap-1">
			Base Salary
			{#if sortColumn === 'salary'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="hidden cursor-pointer px-3 py-3 text-right text-xs font-semibold tracking-wider sm:table-cell sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('stock')}
	>
		<div class="flex items-center justify-end gap-1">
			Monthly Stock
			{#if sortColumn === 'stock'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
	<th
		class="hidden cursor-pointer px-3 py-3 text-right text-xs font-semibold tracking-wider sm:table-cell sm:px-6 sm:py-4 sm:text-sm"
		on:click={() => onSort('bonus')}
	>
		<div class="flex items-center justify-end gap-1">
			Bonus
			{#if sortColumn === 'bonus'}
				<span class="text-base">{sortDirection === 'asc' ? '↑' : '↓'}</span>
			{/if}
		</div>
	</th>
</tr>

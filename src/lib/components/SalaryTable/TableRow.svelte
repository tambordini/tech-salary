<script lang="ts">
	import type { CompanySalary } from '$lib/types/salary';
	import { formatCurrency } from '$lib/utils/formatters';

	export let rowData: CompanySalary;
	export let index: number;
</script>

<tr
	class="transition-colors duration-200 {index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} 
		? 'animate-pulse bg-green-50'
		: 'hover:bg-blue-50/50'}"
>
	<td class="px-3 py-3 text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm"
		>{rowData.company}</td
	>
	<td class="px-3 py-3 text-xs text-gray-700 sm:px-6 sm:py-4 sm:text-sm">{rowData.level}</td>
	<td class="px-3 py-3 text-xs text-gray-700 sm:px-6 sm:py-4 sm:text-sm">{rowData.tag}</td>
	<td class="px-3 py-3 text-xs text-gray-700 sm:px-6 sm:py-4 sm:text-sm"
		>{rowData.experience} Years</td
	>
	<td class="px-3 py-3 text-right text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm"
		>{formatCurrency(rowData.totalCompensation)}</td
	>
	<td class="px-3 py-3 text-right text-xs font-medium text-gray-900 sm:px-6 sm:py-4 sm:text-sm"
		>{formatCurrency(rowData.salary)}</td
	>
	<td
		class="hidden px-3 py-3 text-right text-xs font-medium text-gray-900 sm:table-cell sm:px-6 sm:py-4 sm:text-sm"
		>{formatCurrency(rowData.stock)}</td
	>
	<td
		class="hidden px-3 py-3 text-right text-xs font-medium text-gray-900 sm:table-cell sm:px-6 sm:py-4 sm:text-sm"
		>{formatCurrency(rowData.bonus)}</td
	>
</tr>

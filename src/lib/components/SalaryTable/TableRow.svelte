<script lang="ts">
	import type { CompanySalary } from '$lib/types/salary';
	import { formatCurrency } from '$lib/utils/formatters';
	import { TableRow, TableCell } from '$lib/components/ui/table';

	export let rowData: CompanySalary;
	export let index: number;
</script>

<TableRow
	class="border-b transition-colors duration-200 {index % 2 === 0
		? 'bg-white'
		: 'bg-slate-50/50'} hover:bg-blue-50/50"
>
	<TableCell class="w-[200px] border-r text-xs font-medium text-gray-900 sm:text-sm"
		>{rowData.company}</TableCell
	>
	<TableCell class="w-[140px] border-r text-xs text-gray-700 sm:text-sm">{rowData.level}</TableCell>
	<TableCell class="w-[200px] border-r text-xs text-gray-700 sm:text-sm">{rowData.tag}</TableCell>
	<TableCell class="w-[100px] border-r text-xs text-gray-700 sm:text-sm"
		>{rowData.experience} Years</TableCell
	>
	<TableCell class="w-[130px] border-r text-right text-xs font-medium text-gray-900 sm:text-sm"
		>{formatCurrency(rowData.totalCompensation)}</TableCell
	>
	<TableCell class="w-[120px] border-r text-right text-xs font-medium text-gray-900 sm:text-sm"
		>{formatCurrency(rowData.salary)}</TableCell
	>
	<TableCell
		class="w-[120px] border-r text-right text-xs font-medium text-gray-900 sm:table-cell sm:text-sm"
		>{formatCurrency(rowData.stock)}</TableCell
	>
	<TableCell class="w-[100px] text-right text-xs font-medium text-gray-900 sm:table-cell sm:text-sm"
		>{formatCurrency(rowData.bonus)}</TableCell
	>
</TableRow>

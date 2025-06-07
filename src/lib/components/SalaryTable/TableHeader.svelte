<script lang="ts">
	import { TableHead, TableRow } from '$lib/components/ui/table';
	import type { SortKey, SortState } from '$lib/composables/useSort';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	export let sortState: SortState;
	export let onSort: (column: SortKey) => void;

	export const columns = [
		{
			label: 'บริษัท',
			column: 'company' as SortKey,
			align: 'left',
			width: 'w-[200px]'
		},
		{
			label: 'ระดับ',
			column: 'level' as SortKey,
			align: 'left',
			width: 'w-[140px]'
		},
		{ label: 'แท็ก', column: 'tag' as SortKey, align: 'left', width: 'w-[200px]' },
		{
			label: 'ประสบการณ์',
			column: 'experience' as SortKey,
			align: 'left',
			width: 'w-[120px]'
		},
		{
			label: 'ค่าตอบแทนรวม',
			column: 'totalCompensation' as SortKey,
			align: 'right',
			width: 'w-[160px]'
		},
		{
			label: 'เงินเดือนฐาน',
			column: 'salary' as SortKey,
			align: 'right',
			width: 'w-[150px]'
		},
		{
			label: 'หุ้นรายเดือน',
			column: 'stock' as SortKey,
			align: 'right',
			width: 'w-[130px]'
		},
		{ label: 'โบนัส', column: 'bonus' as SortKey, align: 'right', width: 'w-[100px]' }
	] as const;
</script>

<TableRow class="transition-colors hover:bg-muted/50">
	{#each columns as { label, column, align, width }}
		<TableHead
			class="cursor-pointer text-{align
				? align
				: 'left'} bg-muted/50 text-xs font-semibold tracking-wider transition-all duration-200 hover:bg-muted/80 sm:text-sm {width} group border-r border-border/50 last:border-r-0"
			on:click={() => onSort(column)}
		>
			<div class="flex items-center {align === 'right' ? 'justify-end' : ''} gap-1 py-1">
				<span class="text-foreground/90">{label}</span>
				{#if sortState.key === column}
					<span class="flex items-center text-primary">
						{#if sortState.direction === 'asc'}
							<ChevronUp class="h-4 w-4" />
						{:else if sortState.direction === 'desc'}
							<ChevronDown class="h-4 w-4" />
						{/if}
					</span>
				{:else}
					<span
						class="flex items-center text-muted-foreground/40 group-hover:text-muted-foreground/60"
					>
						<ChevronUp class="h-4 w-4 opacity-0" />
					</span>
				{/if}
			</div>
		</TableHead>
	{/each}
</TableRow>

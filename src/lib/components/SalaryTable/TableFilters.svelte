<script lang="ts">
	import type { TableFilters } from '$lib/types/filters';
	export let filters: TableFilters;
</script>

<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
	<div>
		<input
			type="text"
			bind:value={filters.company}
			placeholder="Filter by company..."
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
		/>
	</div>
	<div>
		<input
			type="text"
			bind:value={filters.level}
			placeholder="Filter by level..."
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
		/>
	</div>
	<div>
		<input
			type="text"
			bind:value={filters.tag}
			placeholder="Filter by tag..."
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
		/>
	</div>
</div>

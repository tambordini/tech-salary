<script lang="ts">
	import type { TableFilters } from '$lib/types/filters';

	export let filters: TableFilters;

	let localFilters = { ...filters };

	function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
		let timeoutId: ReturnType<typeof setTimeout>;
		return ((...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		}) as T;
	}

	const debouncedUpdate = debounce(() => {
		filters = { ...localFilters };
	}, 300);

	function handleInput(field: keyof TableFilters, value: string) {
		localFilters[field] = value;
		debouncedUpdate();
	}
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

<script lang="ts">
	import type { TableFilters } from '$lib/types/filters';
	import { Input } from '$lib/components/ui/input';

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

<div class="mb-3 grid grid-cols-1 gap-2 sm:mb-4 sm:grid-cols-3 sm:gap-3">
	<div>
		<Input
			type="text"
			bind:value={filters.company}
			placeholder="Filter by company..."
			class="text-xs sm:text-sm"
		/>
	</div>
	<div>
		<Input
			type="text"
			bind:value={filters.level}
			placeholder="Filter by level..."
			class="text-xs sm:text-sm"
		/>
	</div>
	<div>
		<Input
			type="text"
			bind:value={filters.tag}
			placeholder="Filter by tag..."
			class="text-xs sm:text-sm"
		/>
	</div>
</div>

import { writable } from 'svelte/store';
import type { CompanySalary } from '$lib/types/salary';

export type SortKey = keyof CompanySalary | 'totalCompensation';
export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortState {
	key: SortKey | null;
	direction: SortDirection;
}

export function useSort() {
	const { subscribe, set, update } = writable<SortState>({
		key: null,
		direction: 'none'
	});

	function toggle(key: SortKey) {
		update((state) => {
			if (state.key === key) {
				// Cycle through: asc -> desc -> none
				switch (state.direction) {
					case 'asc':
						return { key, direction: 'desc' };
					case 'desc':
						return { key: null, direction: 'none' };
					default:
						return { key, direction: 'asc' };
				}
			} else {
				// New column, start with asc
				return { key, direction: 'asc' };
			}
		});
	}

	function sortData(data: CompanySalary[], sortState: SortState): CompanySalary[] {
		if (!sortState.key || sortState.direction === 'none') {
			return data;
		}

		return [...data].sort((a, b) => {
			// Get the value for sorting
			const aVal = a[sortState.key as keyof CompanySalary];
			const bVal = b[sortState.key as keyof CompanySalary];

			// Handle numbers
			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
			}

			// Handle strings
			const aStr = String(aVal).toLowerCase();
			const bStr = String(bVal).toLowerCase();

			if (sortState.direction === 'asc') {
				return aStr.localeCompare(bStr);
			} else {
				return bStr.localeCompare(aStr);
			}
		});
	}

	return {
		subscribe,
		toggle,
		sortData,
		reset: () => set({ key: null, direction: 'none' })
	};
}

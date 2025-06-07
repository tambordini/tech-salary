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
		console.log('Toggle called with:', key);
		update((state) => {
			console.log('Current state:', state);
			if (state.key === key) {
				switch (state.direction) {
					case 'asc':
						console.log('Switching to desc');
						return { key, direction: 'desc' };
					case 'desc':
						console.log('Switching to none');
						return { key: null, direction: 'none' };
					default:
						console.log('Switching to asc');
						return { key, direction: 'asc' };
				}
			} else {
				console.log('New column, setting to asc');
				return { key, direction: 'asc' };
			}
		});
	}

	function sortData(data: CompanySalary[], sortState: SortState): CompanySalary[] {
		if (!sortState.key || sortState.direction === 'none') {
			return data;
		}

		return [...data].sort((a, b) => {
			let aVal: string | number;
			let bVal: string | number;

			if (sortState.key === 'totalCompensation') {
				aVal = a.totalCompensation;
				bVal = b.totalCompensation;
			} else {
				aVal = a[sortState.key as keyof CompanySalary];
				bVal = b[sortState.key as keyof CompanySalary];
			}

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sortState.direction === 'asc' ? aVal - bVal : bVal - aVal;
			}

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

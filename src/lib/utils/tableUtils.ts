import type { CompanySalary } from '$lib/types/salary';

export const applyFilters = (
	data: CompanySalary[],
	filters: { company: string; level: string; tag: string }
): CompanySalary[] => {
	return data.filter((item) => {
		const matchCompany = item.company.toLowerCase().includes(filters.company.toLowerCase());
		const matchLevel = item.level.toLowerCase().includes(filters.level.toLowerCase());
		const matchTag = item.tag.toLowerCase().includes(filters.tag.toLowerCase());
		return matchCompany && matchLevel && matchTag;
	});
};

export function sortData<T extends { base?: number; bonus?: number; stock?: number }>(
	data: T[],
	column: keyof T | 'totalCompensation',
	direction: 'asc' | 'desc' | 'none'
): T[] {
	if (direction === 'none') {
		return [...data];
	}

	return [...data].sort((a, b) => {
		const aValue =
			column === 'totalCompensation' ? (a.base || 0) + (a.bonus || 0) + (a.stock || 0) : a[column];
		const bValue =
			column === 'totalCompensation' ? (b.base || 0) + (b.bonus || 0) + (b.stock || 0) : b[column];

		if (direction === 'asc') {
			return aValue > bValue ? 1 : -1;
		} else {
			return aValue < bValue ? 1 : -1;
		}
	});
}

export const paginateData = <T>(data: T[], currentPage: number, itemsPerPage: number): T[] => {
	return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
};

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
	return Math.ceil(totalItems / itemsPerPage);
};

export const isNewEntry = (newestEntry: string, company: string, position: string): boolean => {
	return newestEntry === `${company}-${position}`;
};

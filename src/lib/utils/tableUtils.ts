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

export const sortData = (
	data: CompanySalary[],
	sortColumn: keyof CompanySalary | 'totalCompensation',
	sortDirection: 'asc' | 'desc'
): CompanySalary[] => {
	return [...data].sort((a, b) => {
		const multiplier = sortDirection === 'asc' ? 1 : -1;

		if (sortColumn === 'totalCompensation') {
			const totalA = (Number(a.salary) || 0) + (Number(a.stock) || 0) + (Number(a.bonus) || 0);
			const totalB = (Number(b.salary) || 0) + (Number(b.stock) || 0) + (Number(b.bonus) || 0);
			return (totalB - totalA) * multiplier;
		}

		if (['salary', 'stock', 'bonus', 'experience'].includes(sortColumn)) {
			const valA = Number(a[sortColumn]) || 0;
			const valB = Number(b[sortColumn]) || 0;
			return (valB - valA) * multiplier;
		}

		const strA = String(a[sortColumn] || '');
		const strB = String(b[sortColumn] || '');
		return strA.localeCompare(strB) * multiplier;
	});
};

export const paginateData = <T>(data: T[], currentPage: number, itemsPerPage: number): T[] => {
	return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
};

export const calculateTotalPages = (totalItems: number, itemsPerPage: number): number => {
	return Math.ceil(totalItems / itemsPerPage);
};

export const isNewEntry = (newestEntry: string, company: string, position: string): boolean => {
	return newestEntry === `${company}-${position}`;
};

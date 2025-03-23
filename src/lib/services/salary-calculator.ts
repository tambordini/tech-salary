import type { CompanySalary } from '../types/salary';

export interface SalaryRankResult {
	rank: number;
	total: number;
	percentile: number;
}

export function calculateSalaryRank(
	salary: number,
	experience: number,
	level: string,
	salaryData: CompanySalary[]
): SalaryRankResult | null {
	const filteredSalaries = salaryData
		.filter((data) => data.level === level && Number(data.experience) === experience)
		.flatMap((company) => Number(company.salary))
		.filter((salary): salary is number => typeof salary === 'number' && !isNaN(salary))
		.sort((a, b) => b - a);

	if (filteredSalaries.length === 0) {
		return null;
	}

	const higherCount = filteredSalaries.filter((s) => s > salary).length;
	const rank = higherCount === 0 ? 1 : higherCount + 1;
	const total = filteredSalaries.length;
	const percentile = ((total - higherCount) / total) * 100;

	return { rank, total, percentile };
}

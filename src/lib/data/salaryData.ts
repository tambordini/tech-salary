import type { CompanySalary } from '../types/salary';

interface RawSalaryData {
	company: string;
	levelName: string;
	tagName: string;
	yearsOfExperience: number | string;
	yearsAtCompany: number | string;
	totalCompensation: string;
	base: string;
	stock: string;
	bonus: string;
}

let salaryData: RawSalaryData[] | null = null;

async function loadSalaryData() {
	if (!salaryData) {
		const module = await import('./data.json');
		salaryData = module.default;
	}
	return salaryData;
}

function createUniqueKey(item: RawSalaryData): string {
	return `${item.company}-${item.levelName}-${item.tagName}-${item.yearsOfExperience}-${item.yearsAtCompany}-${item.totalCompensation}-${item.base}-${item.stock}-${item.bonus}`;
}

async function getUniqueData() {
	const data = await loadSalaryData();
	const seen = new Set<string>();
	return data.filter((item) => {
		const key = createUniqueKey(item);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export async function getCompanySalaries(): Promise<CompanySalary[]> {
	const uniqueData = await getUniqueData();
	return uniqueData.map((item) => ({
		company: item.company,
		level: item.levelName,
		tag: item.tagName,
		experience: `${item.yearsOfExperience}`,
		totalCompensation: parseFloat(item.totalCompensation) || 0,
		salary: parseFloat(item.base) || 0,
		bonus: parseFloat(item.bonus) || 0,
		stock: parseFloat(item.stock) || 0
	}));
}

export const companySalaries: CompanySalary[] = [];

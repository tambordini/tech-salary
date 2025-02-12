import type { CompanySalary } from '../types/salary';
import salaryJsonData from './data.json';

const uniqueSalaryData = salaryJsonData.filter(
	(item, index, self) =>
		index ===
		self.findIndex(
			(t) =>
				t.company === item.company &&
				t.levelName === item.levelName &&
				t.tagName === item.tagName &&
				t.yearsOfExperience === item.yearsOfExperience &&
				t.yearsAtCompany === item.yearsAtCompany &&
				t.totalCompensation === item.totalCompensation &&
				t.base === item.base &&
				t.stock === item.stock &&
				t.bonus === item.bonus
		)
);

export const companySalaries: CompanySalary[] = uniqueSalaryData.map((item) => ({
	company: item.company,
	level: item.levelName,
	tag: item.tagName,
	experience: `${item.yearsOfExperience}`,
	totalCompensation: parseFloat(item.totalCompensation) || 0,
	salary: parseFloat(item.base) || 0,
	bonus: parseFloat(item.bonus) || 0,
	stock: parseFloat(item.stock) || 0
}));

import type { CompanySalary } from '../types/salary';
import salaryJsonData from './data.json';

export const companySalaries: CompanySalary[] = salaryJsonData.map((item) => ({
  company: item.company,
  level: item.levelName,
  tag: item.tagName,
  experience: `${item.yearsAtCompany} Years`,
  yearsOfExperience: `${item.yearsOfExperience} Years`,
  totalCompensation: parseFloat(item.totalCompensation) || 0,
  salary: parseFloat(item.base) || 0,
  bonus: parseFloat(item.bonus) || 0,
  stock: parseFloat(item.stock) || 0,
}));

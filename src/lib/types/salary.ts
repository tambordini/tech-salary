export interface CompanySalary {
	company: string;
	level: string;
	tag: string;
	experience: string;
	salary: number;
	stock: number;
	bonus: number;
	totalCompensation: number;
}

export type SalaryResult = {
	rank: number;
	total: number;
	percentile: number;
	salary: number;
};

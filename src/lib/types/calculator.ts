export interface SalaryResult {
	rank: number;
	total: number;
	percentile: number;
}

export interface ValidationErrors {
	salary?: string;
	experience?: string;
	level?: string;
}

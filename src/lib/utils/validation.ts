export function validateSalary(value: string): string {
	const num = Number(value.replace(/,/g, ''));
	if (!value) return 'กรุณาระบุเงินเดือน';
	if (num < 1000) return 'เงินเดือนต้องมากกว่า 1,000 บาท';
	if (num > 1000000) return 'เงินเดือนต้องไม่เกิน 1,000,000 บาท';
	return '';
}

export const validateExperience = (value: string): string => {
	if (!value) {
		return 'กรุณาเลือกช่วงประสบการณ์';
	}
	return '';
};

export function validateLevel(value: string): string {
	if (!value) return 'กรุณาเลือกระดับตำแหน่ง';
	return '';
}

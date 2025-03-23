export function validateSalary(value: string): string {
	const num = Number(value.replace(/,/g, ''));
	if (!value) return 'กรุณาระบุเงินเดือน';
	if (num < 1000) return 'เงินเดือนต้องมากกว่า 1,000 บาท';
	if (num > 1000000) return 'เงินเดือนต้องไม่เกิน 1,000,000 บาท';
	return '';
}

export function validateExperience(value: string): string {
	const num = Number(value);
	if (!value) return 'กรุณาระบุประสบการณ์';
	if (num < 0) return 'ประสบการณ์ต้องไม่ต่ำกว่า 0 ปี';
	if (num > 50) return 'ประสบการณ์ต้องไม่เกิน 50 ปี';
	return '';
}

export function validateLevel(value: string): string {
	if (!value) return 'กรุณาเลือกระดับตำแหน่ง';
	return '';
}

export const formatCurrency = (amount: string | number | null | undefined): string => {
	if (amount == null || amount === 'N/A') return '-';

	if (typeof amount === 'string') {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount)) return '-';
		amount = numAmount;
	}

	return amount.toLocaleString('th-TH', {
		style: 'currency',
		currency: 'THB',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
};

export const formatNumber = (num: number): string => {
	return num.toLocaleString('th-TH');
};

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString('th-TH', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

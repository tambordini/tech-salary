<script lang="ts">
	import levelOptions from '$lib/data/levels.json';
	import { slide } from 'svelte/transition';
	import type { CompanySalary } from '../types/salary';

	export let salaryData: CompanySalary[];

	let salary = '';
	let experience = '';
	let isCalculating = false;
	let errors: Record<string, string> = {};
	let result: { rank: number; total: number; percentile: number } | null = null;
	let noDataFound = false;

	let level = '';
	let calculatedLevel = '';
	let calculatedExperience = '';

	function debounce<T extends (...args: any[]) => void>(
		fn: T,
		delay: number
	): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		};
	}

	function validateSalary(value: string) {
		const num = Number(value.replace(/,/g, ''));
		if (!value) return 'กรุณาระบุเงินเดือน';
		if (num < 1000) return 'เงินเดือนต้องมากกว่า 1,000 บาท';
		if (num > 1000000) return 'เงินเดือนต้องไม่เกิน 1,000,000 บาท';
		return '';
	}

	function validateExperience(value: string) {
		const num = Number(value);
		if (!value) return 'กรุณาระบุประสบการณ์';
		if (num < 0) return 'ประสบการณ์ต้องไม่ต่ำกว่า 0 ปี';
		if (num > 50) return 'ประสบการณ์ต้องไม่เกิน 50 ปี';
		return '';
	}

	function validateLevel(value: string) {
		if (!value) return 'กรุณาเลือกระดับตำแหน่ง';
		return '';
	}

	const debouncedValidateSalary = debounce((value: string) => {
		errors.salary = validateSalary(value);
	}, 300);

	const debouncedValidateExperience = debounce((value: string) => {
		errors.experience = validateExperience(value);
	}, 300);

	const debouncedValidateLevel = debounce((value: string) => {
		errors.level = validateLevel(value);
	}, 300);

	function handleSalaryInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const value = input.value.replace(/,/g, '');
		salary = value;
		input.value = formatSalary(value);
		debouncedValidateSalary(value);
	}

	function handleExperienceInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		experience = value;
		debouncedValidateExperience(value);
	}

	function validateForm() {
		errors = {
			salary: validateSalary(salary),
			experience: validateExperience(experience),
			level: validateLevel(level)
		};
		return Object.values(errors).every((error) => !error);
	}

	function formatSalary(value: string) {
		return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	async function calculateRank() {
		if (!validateForm()) return;

		isCalculating = true;
		try {
			calculatedLevel = level;
			calculatedExperience = experience;
			const salaryNum = Number(salary.replace(/,/g, ''));
			const expNum = Number(experience);

			const filteredSalaries = salaryData
				.filter((data) => {
					return data.level === calculatedLevel && Number(data.experience) === expNum;
				})
				.flatMap((company) => Number(company.salary))
				.filter((salary): salary is number => typeof salary === 'number' && !isNaN(salary))
				.sort((a, b) => b - a);

			if (filteredSalaries.length === 0) {
				noDataFound = true;
				result = null;
				return;
			}

			noDataFound = false;

			const higherCount = filteredSalaries.filter((s) => s > salaryNum).length;
			const equalCount = filteredSalaries.filter((s) => s === salaryNum).length;

			let rank: number;
			if (higherCount === 0) {
				rank = 1;
			} else if (equalCount > 0) {
				rank = higherCount + 1;
			} else {
				rank = higherCount + 1;
			}

			const total = filteredSalaries.length;
			const percentile = ((total - higherCount) / total) * 100;

			result = { rank, total, percentile };
		} finally {
			isCalculating = false;
		}
	}
</script>

<div class="rounded-xl border border-gray-100 bg-white p-4 shadow-lg sm:p-8">
	<div transition:slide={{ duration: 300 }}>
		<div class="space-y-8">
			<div class="space-y-6">
				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<div class="space-y-2">
						<label for="salary" class="block text-sm font-medium text-gray-700">เงินเดือน *</label>
						<input
							id="salary"
							type="text"
							inputmode="numeric"
							on:input={handleSalaryInput}
							on:blur={handleSalaryInput}
							class="w-full rounded-lg border p-3 transition-all duration-200
				 {errors.salary
								? 'border-red-500 focus:border-red-500 focus:ring-red-500'
								: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
							placeholder="ระบุเงินเดือน"
						/>
						{#if errors.salary}
							<p class="mt-1 text-sm text-red-500">{errors.salary}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="year" class="block text-sm font-medium text-gray-700"
							>ประสบการณ์ (ปี) *</label
						>
						<input
							id="year"
							type="number"
							min="0"
							max="50"
							step="0.5"
							on:input={handleExperienceInput}
							on:blur={handleExperienceInput}
							bind:value={experience}
							class="w-full rounded-lg border p-3 transition-all duration-200
				 {errors.experience
								? 'border-red-500 focus:border-red-500 focus:ring-red-500'
								: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
							placeholder="ระบุจำนวนปี"
						/>
						{#if errors.experience}
							<p class="mt-1 text-sm text-red-500">{errors.experience}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="level" class="block text-sm font-medium text-gray-700">ระดับตำแหน่ง *</label
						>
						<select
							id="level"
							bind:value={level}
							on:change={(e) => debouncedValidateLevel((e.target as HTMLSelectElement).value)}
							class="w-full rounded-lg border p-3 transition-all duration-200
					 {errors.level ? 'border-red-500' : 'border-gray-300'}"
						>
							<option value="">เลือกระดับตำแหน่ง</option>
							{#each levelOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						{#if errors.level}
							<p class="mt-1 text-sm text-red-500">{errors.level}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
			<button
				on:click={calculateRank}
				disabled={isCalculating}
				class="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-medium
				   text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed
				   disabled:opacity-50 sm:py-3
				   {isCalculating ? 'opacity-75' : 'hover:from-blue-700 hover:to-blue-800'}"
			>
				{isCalculating ? 'กำลังคำนวณ...' : 'คำนวณอันดับ'}
			</button>
		</div>
	</div>

	{#if noDataFound}
		<div
			transition:slide={{ duration: 300 }}
			class="mt-6 rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6"
		>
			<h3 class="mb-3 text-xl font-semibold text-yellow-900">ไม่พบข้อมูล</h3>
			<div class="space-y-3">
				<p class="text-gray-700">
					ยังไม่มีข้อมูลเงินเดือนสำหรับ
					<span class="font-semibold text-yellow-800">{calculatedLevel}</span>
					ที่มีประสบการณ์ <span class="font-semibold text-yellow-800">{calculatedExperience}</span> ปี
				</p>
				<p class="text-sm text-gray-600">
					ลองปรับเปลี่ยนระดับตำแหน่งหรือจำนวนปีประสบการณ์เพื่อดูข้อมูลอื่นๆ
				</p>
			</div>
		</div>
	{:else if result}
		<div
			transition:slide={{ duration: 300 }}
			class="mt-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6"
		>
			<h3 class="mb-3 text-xl font-semibold text-blue-900">ผลการคำนวณ (เงินเดือนพื้นฐาน)</h3>
			<div class="space-y-3">
				<p class="text-gray-700">
					คุณอยู่อันดับที่ <span class="font-semibold text-blue-800">{result.rank}</span>
					จากทั้งหมด <span class="font-semibold text-blue-800">{result.total}</span> คน
				</p>
				<p class="text-2xl font-bold text-blue-800">
					Percentile: {result.percentile.toFixed(2)}%
				</p>
			</div>
		</div>
	{/if}
</div>

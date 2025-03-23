<script lang="ts">
	import levelOptions from '$lib/data/levels.json';
	import { debounce, formatSalary } from '$lib/utils/helpers';
	import { validateExperience, validateLevel, validateSalary } from '$lib/utils/validation';
	import { slide } from 'svelte/transition';
	import type { CompanySalary } from '../../types/salary';
	import ResultCard from './ResultCard.svelte';

	export let salaryData: CompanySalary[];

	let salary = '';
	let experience = '';
	let isCalculating = false;
	let errors: Record<string, string> = {};
	let result: { rank: number; total: number; percentile: number; salary: number } | null = null;
	let noDataFound = false;

	let level = '';
	let calculatedLevel = '';
	let calculatedExperience = '';

	const debouncedValidateSalary = debounce((value: string) => {
		errors.salary = validateSalary(value);
	}, 300);

	const debouncedValidateExperience = debounce((value: string) => {
		errors.experience = validateExperience(value);
	}, 300);

	const debouncedValidateLevel = debounce((value: string) => {
		errors.level = validateLevel(value);
	}, 300);

	const handleSalaryInput = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const value = input.value.replace(/,/g, '');
		salary = value;
		input.value = formatSalary(value);
		debouncedValidateSalary(value);
	};

	const handleExperienceInput = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		experience = value;
		debouncedValidateExperience(value);
	};

	const validateForm = () => {
		errors = {
			salary: validateSalary(salary),
			experience: validateExperience(experience),
			level: validateLevel(level)
		};
		return Object.values(errors).every((error) => !error);
	};

	const calculateSalaryRank = async () => {
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

			console.log(filteredSalaries);

			if (filteredSalaries.length === 0) {
				noDataFound = true;
				result = null;
				return;
			}
			noDataFound = false;

			const higherCount = filteredSalaries.filter((s) => s > salaryNum).length;
			const equalCount = filteredSalaries.filter((s) => s === salaryNum).length;
			const rank = higherCount + 1;

			const total = filteredSalaries.length;
			let percentile;

			const totalWithUser = filteredSalaries.length + 1;

			if (total === 0) {
				percentile = 100;
			} else if (equalCount === 0) {
				percentile = ((totalWithUser - higherCount - 1) / totalWithUser) * 100;
			} else {
				const midPointRank = higherCount + equalCount / 2;
				percentile = ((totalWithUser - midPointRank) / totalWithUser) * 100;
			}

			percentile = Math.max(0, Math.min(100, percentile));

			result = {
				rank,
				total: totalWithUser,
				percentile,
				salary: salaryNum
			};
		} finally {
			isCalculating = false;
		}
	};
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
				on:click={calculateSalaryRank}
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
		<ResultCard {result} />
	{/if}
</div>

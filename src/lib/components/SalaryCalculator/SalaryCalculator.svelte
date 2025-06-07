<script lang="ts">
	import levelOptions from '$lib/data/levels.json';
	import { debounce, formatSalary } from '$lib/utils/helpers';
	import { validateExperience, validateLevel, validateSalary } from '$lib/utils/validation';
	import { slide } from 'svelte/transition';
	import type { CompanySalary } from '../../types/salary';
	import ResultCard from './ResultCard.svelte';
	import { experienceRanges } from '$lib/data/experienceRanges';

	export let salaryData: CompanySalary[];

	let salary = '';
	let selectedRange = '';
	let isCalculating = false;
	let errors: Record<string, string> = {};
	let result: { rank: number; total: number; percentile: number; salary: number } | null = null;
	let noDataFound = false;

	let filteredSalaries: number[] = [];
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

	const validateForm = () => {
		errors = {
			salary: validateSalary(salary),
			experience: validateExperience(selectedRange),
			level: validateLevel(level)
		};
		return Object.values(errors).every((error) => !error);
	};

	const calculateSalaryRank = async () => {
		if (!validateForm()) return;

		isCalculating = true;
		try {
			calculatedLevel = level;
			calculatedExperience = selectedRange;
			const salaryNum = Number(salary.replace(/,/g, ''));
			const [minExp, maxExp] = selectedRange.split('-').map(Number);

			filteredSalaries = salaryData
				.filter((data) => {
					const exp = Number(data.experience);
					return data.level === calculatedLevel && exp >= minExp && exp <= maxExp;
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
		<div class="space-y-4 sm:space-y-6">
			<div class="space-y-3 sm:space-y-4">
				<div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
					<div class="space-y-1.5">
						<label for="salary" class="block text-xs font-medium text-gray-700 sm:text-sm"
							>เงินเดือน *</label
						>
						<input
							id="salary"
							type="text"
							inputmode="numeric"
							on:input={handleSalaryInput}
							on:blur={handleSalaryInput}
							class="w-full rounded-lg border px-2.5 py-2 text-sm transition-all duration-200 sm:px-3 sm:py-2.5
				 {errors.salary
								? 'border-red-500 focus:border-red-500 focus:ring-red-500'
								: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
							placeholder="ระบุเงินเดือน"
						/>
						{#if errors.salary}
							<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.salary}</p>
						{/if}
					</div>

					<div class="space-y-1.5">
						<label for="experience" class="block text-xs font-medium text-gray-700 sm:text-sm"
							>ประสบการณ์ *</label
						>
						<select
							id="experience"
							bind:value={selectedRange}
							on:change={(e) => debouncedValidateExperience((e.target as HTMLSelectElement).value)}
							class="w-full rounded-lg border px-2.5 py-2 text-sm transition-all duration-200 sm:px-3 sm:py-2.5
							{errors.experience ? 'border-red-500' : 'border-gray-300'}"
						>
							<option value="">เลือกช่วงประสบการณ์</option>
							{#each experienceRanges as range}
								<option value="{range.min}-{range.max}">{range.label}</option>
							{/each}
						</select>
						{#if errors.experience}
							<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.experience}</p>
						{/if}
					</div>

					<div class="space-y-1.5">
						<label for="level" class="block text-xs font-medium text-gray-700 sm:text-sm"
							>ระดับตำแหน่ง *</label
						>
						<select
							id="level"
							bind:value={level}
							on:change={(e) => debouncedValidateLevel((e.target as HTMLSelectElement).value)}
							class="w-full rounded-lg border px-2.5 py-2 text-sm transition-all duration-200 sm:px-3 sm:py-2.5
					 {errors.level ? 'border-red-500' : 'border-gray-300'}"
						>
							<option value="">เลือกระดับตำแหน่ง</option>
							{#each levelOptions as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
						{#if errors.level}
							<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.level}</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-4">
			<button
				on:click={calculateSalaryRank}
				disabled={isCalculating}
				class="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all
				   duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3
				   sm:text-base
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
		<ResultCard {result} salariesData={filteredSalaries} />
	{/if}
</div>

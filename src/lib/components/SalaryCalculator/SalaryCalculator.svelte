<script lang="ts">
	import levelOptions from '$lib/data/levels.json';
	import { debounce, formatSalary } from '$lib/utils/helpers';
	import { validateExperience, validateLevel, validateSalary } from '$lib/utils/validation';
	import { slide } from 'svelte/transition';
	import type { CompanySalary } from '../../types/salary';
	import ResultCard from './ResultCard.svelte';
	import { experienceRanges } from '$lib/data/experienceRanges';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';

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
	let selectedExperienceRange: { value: string; label: string } | undefined = undefined;
	let selectedLevelOption: { value: string; label: string } | undefined = undefined;

	$: {
		if (selectedExperienceRange) {
			selectedRange = selectedExperienceRange.value;
		}
	}

	$: {
		if (selectedLevelOption) {
			level = selectedLevelOption.value;
		}
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

	const handleExperienceChange = (selected: any) => {
		if (selected?.value) {
			selectedRange = selected.value;
			debouncedValidateExperience(selected.value);
		}
	};

	const handleLevelChange = (selected: any) => {
		if (selected?.value) {
			level = selected.value;
			debouncedValidateLevel(selected.value);
		}
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

<Card.Root class="border-gray-100 bg-white shadow-lg">
	<Card.Content class="p-4 sm:p-8">
		<div transition:slide={{ duration: 300 }}>
			<div class="space-y-4 sm:space-y-6">
				<div class="space-y-3 sm:space-y-4">
					<div class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
						<div class="space-y-1.5">
							<Label for="salary" class="text-xs font-medium text-gray-700 sm:text-sm"
								>เงินเดือน *</Label
							>
							<Input
								id="salary"
								type="text"
								inputmode="numeric"
								on:input={handleSalaryInput}
								on:blur={handleSalaryInput}
								class={errors.salary ? 'border-red-500' : ''}
								placeholder="ระบุเงินเดือน"
							/>
							{#if errors.salary}
								<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.salary}</p>
							{/if}
						</div>

						<div class="space-y-1.5">
							<Label for="experience" class="text-xs font-medium text-gray-700 sm:text-sm"
								>ประสบการณ์ *</Label
							>
							<Select.Root
								bind:selected={selectedExperienceRange}
								onSelectedChange={handleExperienceChange}
							>
								<Select.Trigger class={errors.experience ? 'border-red-500' : ''}>
									<Select.Value placeholder="เลือกช่วงประสบการณ์" />
								</Select.Trigger>
								<Select.Content class="max-h-60 overflow-y-auto">
									{#each experienceRanges as range}
										<Select.Item value="{range.min}-{range.max}" label={range.label}
											>{range.label}</Select.Item
										>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if errors.experience}
								<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.experience}</p>
							{/if}
						</div>

						<div class="space-y-1.5">
							<Label for="level" class="text-xs font-medium text-gray-700 sm:text-sm"
								>ระดับตำแหน่ง *</Label
							>
							<Select.Root bind:selected={selectedLevelOption} onSelectedChange={handleLevelChange}>
								<Select.Trigger class={errors.level ? 'border-red-500' : ''}>
									<Select.Value placeholder="เลือกระดับตำแหน่ง" />
								</Select.Trigger>
								<Select.Content class="max-h-60 overflow-y-auto">
									{#each levelOptions as option}
										<Select.Item value={option} label={option}>{option}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							{#if errors.level}
								<p class="mt-1 text-xs text-red-500 sm:text-sm">{errors.level}</p>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:gap-4">
				<Button
					on:click={calculateSalaryRank}
					disabled={isCalculating}
					class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-medium shadow-sm transition-all
					   duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50
					   sm:text-base
					   {isCalculating ? 'opacity-75' : 'hover:from-blue-700 hover:to-blue-800'}"
				>
					{isCalculating ? 'กำลังคำนวณ...' : 'คำนวณอันดับ'}
				</Button>
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
						ที่มีประสบการณ์
						<span class="font-semibold text-yellow-800">{calculatedExperience}</span> ปี
					</p>
					<p class="text-sm text-gray-600">
						ลองปรับเปลี่ยนระดับตำแหน่งหรือจำนวนปีประสบการณ์เพื่อดูข้อมูลอื่นๆ
					</p>
				</div>
			</div>
		{:else if result}
			<ResultCard {result} salariesData={filteredSalaries} />
		{/if}
	</Card.Content>
</Card.Root>

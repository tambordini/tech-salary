<script lang="ts">
	import OddsLogoUrl from '$lib/assets/images/odds_logo.svg?url';
	import CompanyBenefit from '$lib/components/CompanyBenefit.svelte';
	import SalaryBoosting from '$lib/components/SalaryBoosting.svelte';
	import SalaryCalculator from '$lib/components/SalaryCalculator/SalaryCalculator.svelte';
	import SalaryChart from '$lib/components/SalaryChart.svelte';
	import SalaryTable from '$lib/components/SalaryTable/SalaryTable.svelte';
	import { getCompanySalaries } from '$lib/data/salaryData';
	import { customSalaries } from '$lib/stores/salaryStore';
	import { onMount } from 'svelte';
	import type { CompanySalary } from '$lib/types/salary';

	let language = 'th';
	let combinedSalaryData: CompanySalary[] = [];
	let isLoading = true;

	onMount(async () => {
		try {
			const companySalaries = await getCompanySalaries();
			combinedSalaryData = [...companySalaries, ...$customSalaries];
		} catch (error) {
			console.error('Failed to load salary data:', error);
		} finally {
			isLoading = false;
		}
	});

	$: if ($customSalaries.length > 0) {
		getCompanySalaries().then((companySalaries) => {
			combinedSalaryData = [...companySalaries, ...$customSalaries];
		});
	}

	const content = {
		th: {
			title: 'การวิเคราะห์เงินเดือนวิศวกรซอฟต์แวร์ในประเทศไทย',
			poweredBy: 'Powered By:',
			calculator: 'คำนวณตำแหน่งเงินเดือนของคุณ',
			chart: 'การกระจายตัวของเงินเดือน',
			table: 'รายการเงินเดือนตามบริษัท',
			skills: 'ทักษะที่จำเป็นสำหรับตำแหน่งงาน',
			benefits: 'สวัสดิการของบริษัท'
		},
		en: {
			title: 'Software Engineer Salary Analysis in Thailand',
			poweredBy: 'Powered By:',
			calculator: 'Calculate Your Salary Position',
			chart: 'Salary Distribution',
			table: 'Company Salary List',
			skills: 'Essential Skills for Positions',
			benefits: 'Company Benefits'
		}
	};
</script>

<main class="min-h-screen bg-gray-50 py-4">
	<div class="mx-auto max-w-[1024px] px-4 py-4 sm:px-8 sm:py-8">
		<div class="overflow-hidden rounded-lg bg-white shadow-lg">
			<!-- Fixed Language Toggle -->
			<div class="fixed right-4 top-4 z-50">
				<div class="flex overflow-hidden rounded-lg bg-white/95 shadow-lg backdrop-blur-sm">
					<button
						class="px-3 py-2 text-sm font-medium transition-all duration-200 {language === 'th'
							? 'bg-blue-600 text-white'
							: 'text-gray-600 hover:bg-gray-50'}"
						on:click={() => (language = 'th')}
					>
						TH
					</button>
					<button
						class="px-3 py-2 text-sm font-medium transition-all duration-200 {language === 'en'
							? 'bg-blue-600 text-white'
							: 'text-gray-600 hover:bg-gray-50'}"
						on:click={() => (language = 'en')}
					>
						EN
					</button>
				</div>
			</div>

			<div class="bg-header bg-cover bg-center bg-no-repeat p-6 text-white sm:p-12">
				<h1 class="mb-4 text-center text-xl font-bold sm:text-3xl">
					{content[language as keyof typeof content].title}
				</h1>
				<div class="text-center text-gray-100">
					<p class="flex items-center justify-center text-base sm:text-lg">
						{content[language as keyof typeof content].poweredBy}
						<img src={OddsLogoUrl} alt="ODDS Logo" class="ml-2 h-4 sm:h-6" />
					</p>
				</div>
			</div>

			<div class="p-4 sm:p-8">
				{#if isLoading}
					<div class="flex items-center justify-center py-12">
						<div class="text-center">
							<div
								class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
							></div>
							<p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
						</div>
					</div>
				{:else}
					<section class="mb-12">
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">
							{content[language as keyof typeof content].calculator}
						</h2>
						<SalaryCalculator salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">
							{content[language as keyof typeof content].chart}
						</h2>
						<SalaryChart salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">
							{content[language as keyof typeof content].table}
						</h2>
						<SalaryTable salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🎯</span>
							{content[language as keyof typeof content].skills}
						</h2>
						<SalaryBoosting />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🎁</span>
							{content[language as keyof typeof content].benefits}
						</h2>
						<CompanyBenefit />
					</section>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.bg-header {
		background-image: url('$lib/assets/images/background_header.svg?url');
	}
</style>

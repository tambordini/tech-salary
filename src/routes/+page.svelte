<script lang="ts">
	import OddsLogoUrl from '$lib/assets/images/odds_logo.svg?url';
	import CompanyBenefit from '$lib/components/CompanyBenefit.svelte';
	import SalaryBoosting from '$lib/components/SalaryBoosting.svelte';
	import SalaryCalculator from '$lib/components/SalaryCalculator/SalaryCalculator.svelte';
	import SalaryChart from '$lib/components/SalaryChart.svelte';
	import SalaryTable from '$lib/components/SalaryTable/SalaryTable.svelte';
	import { companySalaries } from '$lib/data/salaryData';
	import { customSalaries } from '$lib/stores/salaryStore';

	let language = 'th';
	$: combinedSalaryData = [...companySalaries, ...$customSalaries];

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
			<div class="bg-header bg-cover bg-center bg-no-repeat p-6 text-white sm:p-12">
				<div class="mb-4 flex justify-end">
					<div class="flex overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm">
						<button
							class="px-4 py-2 text-sm font-medium transition-all {language === 'th'
								? 'bg-white/20 text-white'
								: 'text-white/70 hover:text-white'}"
							on:click={() => (language = 'th')}
						>
							ไทย
						</button>
						<button
							class="px-4 py-2 text-sm font-medium transition-all {language === 'en'
								? 'bg-white/20 text-white'
								: 'text-white/70 hover:text-white'}"
							on:click={() => (language = 'en')}
						>
							EN
						</button>
					</div>
				</div>

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
				<section class="mb-12">
					<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
						<span class="mr-2">🎯</span>
						{content[language as keyof typeof content].calculator}
					</h2>
					<SalaryCalculator salaryData={combinedSalaryData} />
				</section>

				<section class="mb-12">
					<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
						<span class="mr-2">📈</span>
						{content[language as keyof typeof content].chart}
					</h2>
					<SalaryChart salaryData={combinedSalaryData} />
				</section>

				<section class="mb-12">
					<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
						<span class="mr-2">🏢</span>
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
			</div>
		</div>
	</div>
</main>

<style>
	.bg-header {
		background-image: url('$lib/assets/images/background_header.svg?url');
	}
</style>

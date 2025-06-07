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
</script>

<main class="min-h-screen bg-gray-50 py-4">
	<div class="mx-auto max-w-[1024px] px-4 py-4 sm:px-8 sm:py-8">
		<div class="overflow-hidden rounded-lg bg-white shadow-lg">
			<div class="bg-header bg-cover bg-center bg-no-repeat p-6 text-white sm:p-12">
				<h1 class="mb-4 text-center text-xl font-bold sm:text-3xl">
					การวิเคราะห์เงินเดือนวิศวกรซอฟต์แวร์ในประเทศไทย
				</h1>
				<div class="text-center text-gray-100">
					<p class="flex items-center justify-center text-base sm:text-lg">
						Powered By:
						<img src={OddsLogoUrl} alt="ODDS Logo" class="ml-2 h-4 sm:h-6" />
					</p>
					<div class="mt-3 rounded-lg px-4 py-2 backdrop-blur-sm">
						<p class="text-sm font-medium">ข้อมูลอัพเดทเมื่อ : 7 มิถุนายน 2568</p>
					</div>
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
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">คำนวณตำแหน่งเงินเดือนของคุณ</h2>
						<SalaryCalculator salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">การกระจายตัวของเงินเดือน</h2>
						<SalaryChart salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 text-2xl font-semibold text-gray-800">รายการเงินเดือนตามบริษัท</h2>
						<SalaryTable salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							ทักษะที่จำเป็นสำหรับตำแหน่งงาน
						</h2>
						<SalaryBoosting />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							สวัสดิการของบริษัท
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

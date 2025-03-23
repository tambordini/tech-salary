<script lang="ts">
	import OddsLogoUrl from '$lib/assets/images/odds_logo.svg?url';
	import CompanyBenefit from '$lib/components/CompanyBenefit.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SalaryBoosting from '$lib/components/SalaryBoosting.svelte';
	import SalaryCalculator from '$lib/components/SalaryCalculator/SalaryCalculator.svelte';
	import SalaryChart from '$lib/components/SalaryChart.svelte';
	import SalaryTable from '$lib/components/SalaryTable/SalaryTable.svelte';
	import { companySalaries } from '$lib/data/salaryData';
	import { customSalaries } from '$lib/stores/salaryStore';
	import { onMount } from 'svelte';

	let isLoading = true;
	$: combinedSalaryData = [...companySalaries, ...$customSalaries];

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
		}, 1000);
	});
</script>

{#if isLoading}
	<Loading />
{:else}
	<main class="min-h-screen bg-gray-50 py-4">
		<div class="mx-auto max-w-[1024px] px-4 py-4 sm:px-8 sm:py-8">
			<div class="overflow-hidden rounded-lg bg-white shadow-lg">
				<div class="bg-header bg-cover bg-center bg-no-repeat p-6 text-white sm:p-12">
					<h1 class="mb-4 text-center text-xl font-bold sm:text-3xl">
						การวิเคราะห์เงินเดือนวิศวกรซอฟต์แวร์ในประเทศไทย
					</h1>
					<div class="text-center text-gray-100">
						<p class="flex items-center justify-center text-base sm:text-lg">
							Powered By: <img src={OddsLogoUrl} alt="ODDS Logo" class="ml-2 h-4 sm:h-6" />
						</p>
					</div>
				</div>

				<div class="p-4 sm:p-8">
					<section class="mb-8 sm:mb-12">
						<h2
							class="mb-4 flex items-center text-xl font-semibold text-gray-800 sm:mb-6 sm:text-2xl"
						>
							<span class="mr-2">📊</span>
							บทคัดย่อ
						</h2>
						<p class="leading-relaxed text-gray-600">
							งานวิจัยนี้วิเคราะห์การกระจายตัวของเงินเดือนวิศวกรซอฟต์แวร์ระดับอาวุโสในประเทศไทย
							โดยมุ่งเน้นที่แนวโน้มค่าตอบแทนสำหรับผู้เชี่ยวชาญที่มีประสบการณ์สูง
							ข้อมูลนี้แสดงให้เห็นภาพรวมของค่าตอบแทนวิศวกรอาวุโสในเทคโนโลยีและบริษัทต่างๆ
						</p>
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🎯</span>
							คำนวณตำแหน่งเงินเดือนของคุณ
						</h2>
						<SalaryCalculator salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">📈</span>
							การกระจายตัวของเงินเดือน
						</h2>
						<SalaryChart salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🏢</span>
							รายการเงินเดือนตามบริษัท
						</h2>
						<SalaryTable salaryData={combinedSalaryData} />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🎯</span>
							ทักษะที่จำเป็นสำหรับตำแหน่งงาน
						</h2>
						<SalaryBoosting />
					</section>

					<section class="mb-12">
						<h2 class="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<span class="mr-2">🎁</span>
							สวัสดิการของบริษัท
						</h2>
						<CompanyBenefit />
					</section>
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	.bg-header {
		background-image: url('$lib/assets/images/background_header.svg?url');
	}
</style>

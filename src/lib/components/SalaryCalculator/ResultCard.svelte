<script lang="ts">
	import { formatSalary } from '$lib/utils/helpers';

	export let result: {
		rank: number;
		total: number;
		percentile: number;
		salary: number;
	};
	export let salariesData: number[];

	$: salaryScale = salariesData.map((salary) => ({
		salary,
		isUser: false
	}));

	$: {
		salaryScale.splice(result.rank - 1, 0, {
			salary: result.salary,
			isUser: true
		});
	}

	$: salaryScaleWithRank = salaryScale.map((item, index) => ({
		...item,
		rank: index + 1
	}));
</script>

<div class="mt-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
	<h3 class="mb-4 text-xl font-semibold text-blue-900">ผลการเปรียบเทียบเงินเดือน</h3>

	<div class="space-y-4">
		<div class="mt-4 space-y-2 rounded-lg bg-white p-4">
			<p class="text-sm font-medium text-gray-700">เปรียบเทียบกับข้อมูลทั้งหมด:</p>
			<div class="space-y-2">
				{#each salaryScaleWithRank as item}
					<div class="flex items-center gap-2 {item.isUser ? 'rounded-md bg-blue-50 p-2' : ''}">
						<span class="min-w-[3rem] text-sm text-gray-500">#{item.rank}</span>
						<div
							class="flex-1 text-sm {item.isUser ? 'font-medium text-blue-800' : 'text-gray-600'}"
						>
							{formatSalary(item.salary)} บาท
							{#if item.isUser}
								<span class="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
									คุณอยู่ตรงนี้
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="flex flex-row items-baseline gap-3">
			<p class="text-sm text-gray-600">คิดเป็น</p>
			<p class="text-lg font-bold text-blue-600">
				{result.percentile.toFixed(1)}%
			</p>
			<p class="text-sm text-gray-600">ของข้อมูลทั้งหมด</p>
		</div>
	</div>
</div>

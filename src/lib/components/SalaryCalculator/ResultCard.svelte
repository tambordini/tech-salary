<script lang="ts">
	import { formatSalary } from '$lib/utils/helpers';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

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

<Card.Root class="mt-4 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 sm:mt-6">
	<Card.Header>
		<Card.Title class="text-lg font-semibold text-blue-900 sm:text-xl">
			ผลการเปรียบเทียบเงินเดือน
		</Card.Title>
	</Card.Header>
	<Card.Content class="space-y-3 sm:space-y-4">
		<Card.Root class="bg-white">
			<Card.Content class="p-3 sm:p-4">
				<p class="mb-2 text-xs font-medium text-gray-700 sm:mb-3 sm:text-sm">
					เปรียบเทียบกับข้อมูลทั้งหมด:
				</p>
				<div class="space-y-1.5 sm:space-y-2">
					{#each salaryScaleWithRank as item}
						<div
							class="flex items-center gap-2 {item.isUser
								? 'rounded-md bg-blue-50 p-1.5 sm:p-2'
								: ''}"
						>
							<span class="min-w-[2.5rem] text-xs text-gray-500 sm:min-w-[3rem] sm:text-sm"
								>#{item.rank}</span
							>
							<div
								class="flex-1 text-xs sm:text-sm {item.isUser
									? 'font-medium text-blue-800'
									: 'text-gray-600'}"
							>
								{formatSalary(item.salary)} บาท
								{#if item.isUser}
									<Badge variant="secondary" class="ml-1 bg-blue-100 text-blue-800 sm:ml-2">
										คุณอยู่ตรงนี้
									</Badge>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<div class="flex flex-row items-baseline gap-2 sm:gap-3">
			<p class="text-xs text-gray-600 sm:text-sm">คิดเป็น</p>
			<p class="text-base font-bold text-blue-600 sm:text-lg">
				{result.percentile.toFixed(1)}%
			</p>
			<p class="text-xs text-gray-600 sm:text-sm">ของข้อมูลทั้งหมด</p>
		</div>
	</Card.Content>
</Card.Root>

<script lang="ts">
	import { formatSalary } from '$lib/utils/helpers';

	export let result: {
		rank: number;
		total: number;
		percentile: number;
		salary: number;
	};

	$: formattedSalary = formatSalary(result.salary.toString());
	$: databaseTotal = result.total - 1;
</script>

<div class="mt-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
	<h3 class="mb-4 text-xl font-semibold text-blue-900">ผลการเปรียบเทียบเงินเดือน</h3>

	<div class="space-y-2">
		<p class="text-gray-700">
			เงินเดือน <span class="font-semibold text-blue-800">{formattedSalary}</span> บาท
		</p>

		<div class="space-y-2">
			<p class="text-gray-700">
				อยู่อันดับที่ <span class="font-semibold text-blue-800">{result.rank}</span>
				เมื่อเทียบกับข้อมูลทั้งหมด <span class="font-semibold text-blue-800">{databaseTotal}</span> รายการ
			</p>
			<p class="text-sm text-gray-600">
				(สูงกว่า {result.percentile.toFixed(1)}% ของกลุ่มตัวอย่างทั้งหมด)
			</p>
		</div>
	</div>
</div>

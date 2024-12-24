<script lang="ts">
  import type { CompanySalary } from '../types/salary';
  import { customSalaries } from '../stores/salaryStore';

  export let salaryData: CompanySalary[];

  let salary = '';
  let experience = '';
  let company = '';
  let position = '';
  let result: { rank: number; total: number; percentile: number } | null = null;

  function calculateRank() {
    const salaryNum = Number(salary);
    if (!salaryNum) return;

    const allSalaries = salaryData.flatMap((company) => company.salary).sort((a, b) => b - a);

    const rank = allSalaries.findIndex((s) => salaryNum >= s) + 1;
    const total = allSalaries.length;
    const percentile = ((total - rank + 1) / total) * 100;

    result = { rank, total, percentile };
  }

  function addToData() {
    if (!salary || !experience || !company || !position) return;

    const newEntry: CompanySalary = {
      company,
      position,
      level: 'Custom',
      experience,
      salary: Number(salary),
    };

    customSalaries.update((entries) => [...entries, newEntry]);

    // Reset form
    salary = '';
    experience = '';
    company = '';
    position = '';
  }
</script>

<div class="bg-white p-6 rounded-lg shadow-sm">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="space-y-2">
      <label for="salary" class="block text-sm font-medium text-gray-700">เงินเดือน</label>
      <input
        id="salary"
        type="number"
        bind:value={salary}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder="ระบุเงินเดือน"
      />
    </div>

    <div class="space-y-2">
      <label for="year" class="block text-sm font-medium text-gray-700">ประสบการณ์ (ปี)</label>
      <input
        id="year"
        type="number"
        bind:value={experience}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder="ระบุจำนวนปี"
      />
    </div>

    <div class="space-y-2">
      <label for="company" class="block text-sm font-medium text-gray-700">บริษัท</label>
      <input
        id="company"
        type="text"
        bind:value={company}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder="ระบุชื่อบริษัท"
      />
    </div>

    <div class="space-y-2">
      <label for="position" class="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
      <input
        type="text"
        bind:value={position}
        class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        placeholder="ระบุตำแหน่ง"
      />
    </div>
  </div>

  <div class="flex gap-4 mt-4">
    <button
      on:click={calculateRank}
      class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
    >
      คำนวณอันดับ
    </button>
    <button
      on:click={addToData}
      class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
    >
      เพิ่มข้อมูล
    </button>
  </div>

  {#if result}
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-lg mb-2">ผลการคำนวณ</h3>
      <p>คุณอยู่อันดับที่ {result.rank} จากทั้งหมด {result.total} คน</p>
      <p class="text-lg font-medium text-blue-800 mt-2">
        Percentile: {result.percentile.toFixed(2)}%
      </p>
      <p class="text-sm text-gray-600 mt-1">
        (เงินเดือนของคุณสูงกว่า {result.percentile.toFixed(2)}% ของข้อมูลทั้งหมด)
      </p>
    </div>
  {/if}
</div>

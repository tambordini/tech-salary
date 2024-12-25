<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { CompanySalary } from '../types/salary';
  import { customSalaries, newestEntry } from '../stores/salaryStore';

  const chevronDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>`;
  const chevronUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>`;

  export let salaryData: CompanySalary[];

  let isExpanded = false;
  let salary = '';
  let experience = '';
  let company = '';
  let position = '';
  let result: { rank: number; total: number; percentile: number } | null = null;

  function calculateRank() {
    const salaryNum = Number(salary);
    if (!salaryNum) return;

    const allSalaries = salaryData.flatMap((company) => company.salary).sort((a, b) => b - a);

    // Find how many salaries are greater than or equal to the input salary
    const rank = allSalaries.filter((s) => s >= salaryNum).length;
    const total = allSalaries.length;
    // Calculate percentile based on how many salaries are below the input salary
    const percentile = ((total - rank) / total) * 100;

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

    // Set the newest entry identifier
    newestEntry.set(`${company}-${position}`);

    // Clear the highlight after 3 seconds
    setTimeout(() => {
      newestEntry.set(null);
    }, 3000);

    // Reset form
    salary = '';
    experience = '';
    company = '';
    position = '';
  }
</script>

<div class="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100">
  <button
    on:click={() => (isExpanded = !isExpanded)}
    class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg
           hover:from-blue-700 hover:to-blue-800 transition-all duration-200
           flex items-center justify-center gap-2 font-medium"
  >
    {@html isExpanded ? chevronUpIcon : chevronDownIcon}
    {isExpanded ? 'ซ่อนการคำนวณ' : 'เริ่มคำนวณเงินเดือน'}
  </button>

  {#if isExpanded}
    <div transition:slide={{ duration: 300 }} class="mt-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div class="space-y-2">
          <label for="salary" class="block text-sm font-medium text-gray-700">เงินเดือน</label>
          <input
            id="salary"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            bind:value={salary}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition-all duration-200 text-base md:text-sm"
            placeholder="ระบุเงินเดือน"
          />
        </div>

        <div class="space-y-2">
          <label for="year" class="block text-sm font-medium text-gray-700">ประสบการณ์ (ปี)</label>
          <input
            id="year"
            type="number"
            inputmode="numeric"
            pattern="[0-9]*"
            bind:value={experience}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition-all duration-200 text-base md:text-sm"
            placeholder="ระบุจำนวนปี"
          />
        </div>

        <div class="space-y-2">
          <label for="company" class="block text-sm font-medium text-gray-700">บริษัท</label>
          <input
            id="company"
            type="text"
            inputmode="text"
            autocomplete="organization"
            bind:value={company}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition-all duration-200 text-base md:text-sm"
            placeholder="ระบุชื่อบริษัท"
          />
        </div>

        <div class="space-y-2">
          <label for="position" class="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
          <input
            id="position"
            type="text"
            inputmode="text"
            autocomplete="organization-title"
            bind:value={position}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition-all duration-200 text-base md:text-sm"
            placeholder="ระบุตำแหน่ง"
          />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
        <button
          on:click={calculateRank}
          class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-3 px-6
                 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200
                 font-medium shadow-sm hover:shadow-md text-base md:text-sm"
        >
          คำนวณอันดับ
        </button>
        <button
          on:click={addToData}
          class="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 sm:py-3 px-6
                 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200
                 font-medium shadow-sm hover:shadow-md text-base md:text-sm"
        >
          เพิ่มข้อมูล
        </button>
      </div>
    </div>
  {/if}

  {#if result}
    <div
      transition:slide={{ duration: 300 }}
      class="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
    >
      <h3 class="font-semibold text-xl mb-3 text-blue-900">ผลการคำนวณ</h3>
      <div class="space-y-3">
        <p class="text-gray-700">
          คุณอยู่อันดับที่ <span class="font-semibold text-blue-800">{result.rank}</span>
          จากทั้งหมด <span class="font-semibold text-blue-800">{result.total}</span> คน
        </p>
        <p class="text-2xl font-bold text-blue-800">
          Percentile: {result.percentile.toFixed(2)}%
        </p>
        <p class="text-sm text-gray-600">
          (เงินเดือนของคุณสูงกว่า {result.percentile.toFixed(2)}% ของข้อมูลทั้งหมด)
        </p>
      </div>
    </div>
  {/if}
</div>

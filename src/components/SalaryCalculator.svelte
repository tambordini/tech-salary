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
  let isCalculating = false;
  let isSubmitting = false;
  let errors: Record<string, string> = {};
  let result: { rank: number; total: number; percentile: number } | null = null;

  function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  function validateSalary(value: string) {
    const num = Number(value.replace(/,/g, ''));
    if (!value) return 'กรุณาระบุเงินเดือน';
    if (num < 1000) return 'เงินเดือนต้องมากกว่า 1,000 บาท';
    if (num > 1000000) return 'เงินเดือนต้องไม่เกิน 1,000,000 บาท';
    return '';
  }

  function validateExperience(value: string) {
    const num = Number(value);
    if (!value) return 'กรุณาระบุประสบการณ์';
    if (num < 0) return 'ประสบการณ์ต้องไม่ต่ำกว่า 0 ปี';
    if (num > 50) return 'ประสบการณ์ต้องไม่เกิน 50 ปี';
    return '';
  }

  function validateCompany(value: string) {
    if (!value) return 'กรุณาระบุชื่อบริษัท';
    if (value.length < 2) return 'ชื่อบริษัทต้องมีอย่างน้อย 2 ตัวอักษร';
    return '';
  }

  function validatePosition(value: string) {
    if (!value) return 'กรุณาระบุตำแหน่ง';
    if (value.length < 2) return 'ตำแหน่งต้องมีอย่างน้อย 2 ตัวอักษร';
    return '';
  }

  const debouncedValidateSalary = debounce((value: string) => {
    errors.salary = validateSalary(value);
  }, 300);

  const debouncedValidateExperience = debounce((value: string) => {
    errors.experience = validateExperience(value);
  }, 300);

  const debouncedValidateCompany = debounce((value: string) => {
    errors.company = validateCompany(value);
  }, 300);

  const debouncedValidatePosition = debounce((value: string) => {
    errors.position = validatePosition(value);
  }, 300);

  // Modified input handlers
  function handleSalaryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/,/g, '');
    salary = value;
    input.value = formatSalary(value);
    debouncedValidateSalary(value);
  }

  function handleExperienceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    experience = value;
    debouncedValidateExperience(value);
  }

  function handleCompanyInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    company = value;
    debouncedValidateCompany(value);
  }

  function handlePositionInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    position = value;
    debouncedValidatePosition(value);
  }

  function validateForm() {
    errors = {
      salary: validateSalary(salary),
      experience: validateExperience(experience),
      company: validateCompany(company),
      position: validatePosition(position),
    };
    return Object.values(errors).every((error) => !error);
  }

  // Format salary with commas
  function formatSalary(value: string) {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  async function calculateRank() {
    if (!validateForm()) return;

    isCalculating = true;
    try {
      const salaryNum = Number(salary.replace(/,/g, ''));
      const allSalaries = salaryData.flatMap((company) => company.salary).sort((a, b) => b - a);
      const rank = allSalaries.filter((s) => s >= salaryNum).length;
      const total = allSalaries.length;
      const percentile = ((total - rank) / total) * 100;
      result = { rank, total, percentile };
    } finally {
      isCalculating = false;
    }
  }

  async function addToData() {
    if (!validateForm()) return;

    isSubmitting = true;
    try {
      const newEntry: CompanySalary = {
        company,
        position,
        level: 'Custom',
        experience,
        salary: Number(salary.replace(/,/g, '')),
      };

      customSalaries.update((entries) => [...entries, newEntry]);
      newestEntry.set(`${company}-${position}`);
      setTimeout(() => newestEntry.set(null), 3000);

      // Reset form
      salary = '';
      experience = '';
      company = '';
      position = '';
      errors = {};
    } finally {
      isSubmitting = false;
    }
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
            type="text"
            inputmode="numeric"
            on:input={handleSalaryInput}
            on:blur={handleSalaryInput}
            class="w-full p-3 border rounded-lg transition-all duration-200 text-base md:text-sm
                   {errors.salary
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
            placeholder="ระบุเงินเดือน"
          />
          {#if errors.salary}
            <p class="text-red-500 text-sm mt-1">{errors.salary}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="year" class="block text-sm font-medium text-gray-700">ประสบการณ์ (ปี)</label>
          <input
            id="year"
            type="number"
            min="0"
            max="50"
            step="0.5"
            on:input={handleExperienceInput}
            on:blur={handleExperienceInput}
            bind:value={experience}
            class="w-full p-3 border rounded-lg transition-all duration-200 text-base md:text-sm
                   {errors.experience
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
            placeholder="ระบุจำนวนปี"
          />
          {#if errors.experience}
            <p class="text-red-500 text-sm mt-1">{errors.experience}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="company" class="block text-sm font-medium text-gray-700">บริษัท</label>
          <input
            id="company"
            type="text"
            on:input={handleCompanyInput}
            on:blur={handleCompanyInput}
            bind:value={company}
            minlength="2"
            class="w-full p-3 border rounded-lg transition-all duration-200 text-base md:text-sm
                   {errors.company
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
            placeholder="ระบุชื่อบริษัท"
          />
          {#if errors.company}
            <p class="text-red-500 text-sm mt-1">{errors.company}</p>
          {/if}
        </div>

        <div class="space-y-2">
          <label for="position" class="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
          <input
            id="position"
            type="text"
            on:input={handlePositionInput}
            on:blur={handlePositionInput}
            bind:value={position}
            minlength="2"
            class="w-full p-3 border rounded-lg transition-all duration-200 text-base md:text-sm
                   {errors.position
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
            placeholder="ระบุตำแหน่ง"
          />
          {#if errors.position}
            <p class="text-red-500 text-sm mt-1">{errors.position}</p>
          {/if}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
        <button
          on:click={calculateRank}
          disabled={isCalculating}
          class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-3 px-6
                 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md
                 disabled:opacity-50 disabled:cursor-not-allowed
                 {isCalculating ? 'opacity-75' : 'hover:from-blue-700 hover:to-blue-800'}"
        >
          {isCalculating ? 'กำลังคำนวณ...' : 'คำนวณอันดับ'}
        </button>
        <button
          on:click={addToData}
          disabled={isSubmitting}
          class="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 sm:py-3 px-6
                 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md
                 disabled:opacity-50 disabled:cursor-not-allowed
                 {isSubmitting ? 'opacity-75' : 'hover:from-green-700 hover:to-green-800'}"
        >
          {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มข้อมูล'}
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

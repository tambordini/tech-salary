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
  let isCalculating = false;
  let isSubmitting = false;
  let errors: Record<string, string> = {};
  let result: { rank: number; total: number; percentile: number } | null = null;

  let level = '';
  let tag = '';
  let stock = '';
  let bonus = '';

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

  function validateLevel(value: string) {
    if (!value) return 'กรุณาระบุระดับตำแหน่ง';
    if (value.length < 2) return 'ระดับตำแหน่งต้องมีอย่างน้อย 2 ตัวอักษร';
    return '';
  }

  function validateTag(value: string) {
    if (!value) return 'กรุณาระบุแท็ก';
    return '';
  }

  function validateStock(value: string) {
    const num = Number(value.replace(/,/g, ''));
    if (!value) return ''; // Optional field
    if (num < 0) return 'มูลค่าหุ้นต้องไม่ต่ำกว่า 0 บาท';
    if (num > 10000000) return 'มูลค่าหุ้นต้องไม่เกิน 10,000,000 บาท';
    return '';
  }

  function validateBonus(value: string) {
    const num = Number(value.replace(/,/g, ''));
    if (!value) return ''; // Optional field
    if (num < 0) return 'โบนัสต้องไม่ต่ำกว่า 0 บาท';
    if (num > 1000000) return 'โบนัสต้องไม่เกิน 1,000,000 บาท';
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

  const debouncedValidateLevel = debounce((value: string) => {
    errors.level = validateLevel(value);
  }, 300);

  const debouncedValidateTag = debounce((value: string) => {
    errors.tag = validateTag(value);
  }, 300);

  const debouncedValidateStock = debounce((value: string) => {
    errors.stock = validateStock(value);
  }, 300);

  const debouncedValidateBonus = debounce((value: string) => {
    errors.bonus = validateBonus(value);
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

  function handleStockInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/,/g, '');
    stock = value;
    input.value = formatSalary(value);
    debouncedValidateStock(value);
  }

  function handleBonusInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/,/g, '');
    bonus = value;
    input.value = formatSalary(value);
    debouncedValidateBonus(value);
  }

  function validateForm() {
    errors = {
      salary: validateSalary(salary),
      experience: validateExperience(experience),
      company: validateCompany(company),
      level: validateLevel(level),
      tag: validateTag(tag),
      stock: validateStock(stock),
      bonus: validateBonus(bonus),
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
      const allSalaries = salaryData
        .flatMap((company) => company.totalCompensation)
        .filter((salary): salary is number => typeof salary === 'number' && !isNaN(salary))
        .sort((a, b) => b - a);
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
      const baseSalary = Number(salary.replace(/,/g, ''));
      const stockValue = Number(stock.replace(/,/g, '')) || 0;
      const bonusValue = Number(bonus.replace(/,/g, '')) || 0;

      const newEntry: CompanySalary = {
        company,
        level,
        tag,
        experience,
        salary: baseSalary,
        stock: stockValue,
        bonus: bonusValue,
        totalCompensation: baseSalary + stockValue + bonusValue,
      };

      customSalaries.update((entries) => [...entries, newEntry]);
      newestEntry.set(`${company}-${level}`);
      setTimeout(() => newestEntry.set(null), 3000);

      // Reset form
      salary = '';
      experience = '';
      company = '';
      level = '';
      tag = '';
      stock = '';
      bonus = '';
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
      <div class="space-y-8">
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="salary" class="block text-sm font-medium text-gray-700">เงินเดือน *</label
              >
              <input
                id="salary"
                type="text"
                inputmode="numeric"
                on:input={handleSalaryInput}
                on:blur={handleSalaryInput}
                class="w-full p-3 border rounded-lg transition-all duration-200
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
              <label for="year" class="block text-sm font-medium text-gray-700"
                >ประสบการณ์ (ปี) *</label
              >
              <input
                id="year"
                type="number"
                min="0"
                max="50"
                step="0.5"
                on:input={handleExperienceInput}
                on:blur={handleExperienceInput}
                bind:value={experience}
                class="w-full p-3 border rounded-lg transition-all duration-200
               {errors.experience
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
                placeholder="ระบุจำนวนปี"
              />
              {#if errors.experience}
                <p class="text-red-500 text-sm mt-1">{errors.experience}</p>
              {/if}
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label for="company" class="block text-sm font-medium text-gray-700">บริษัท *</label>
              <input
                id="company"
                type="text"
                on:input={handleCompanyInput}
                on:blur={handleCompanyInput}
                bind:value={company}
                minlength="2"
                class="w-full p-3 border rounded-lg transition-all duration-200
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
              <label for="level" class="block text-sm font-medium text-gray-700"
                >ระดับตำแหน่ง *</label
              >
              <input
                id="level"
                type="text"
                bind:value={level}
                on:input={(e) => debouncedValidateLevel((e.target as HTMLInputElement).value)}
                class="w-full p-3 border rounded-lg transition-all duration-200
               {errors.level ? 'border-red-500' : 'border-gray-300'}"
                placeholder="เช่น Senior, Staff"
              />
              {#if errors.level}
                <p class="text-red-500 text-sm mt-1">{errors.level}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <label for="tag" class="block text-sm font-medium text-gray-700">แท็ก *</label>
              <input
                id="tag"
                type="text"
                bind:value={tag}
                on:input={(e) => debouncedValidateTag((e.target as HTMLInputElement).value)}
                class="w-full p-3 border rounded-lg transition-all duration-200
               {errors.tag ? 'border-red-500' : 'border-gray-300'}"
                placeholder="เช่น Frontend, Backend"
              />
              {#if errors.tag}
                <p class="text-red-500 text-sm mt-1">{errors.tag}</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Additional Compensation Section -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="stock" class="block text-sm font-medium text-gray-700"
                >มูลค่าหุ้นต่อปี</label
              >
              <input
                id="stock"
                type="text"
                inputmode="numeric"
                on:input={handleStockInput}
                on:blur={handleStockInput}
                class="w-full p-3 border rounded-lg transition-all duration-200
               {errors.stock ? 'border-red-500' : 'border-gray-300'}"
                placeholder="ระบุมูลค่าหุ้น"
              />
              {#if errors.stock}
                <p class="text-red-500 text-sm mt-1">{errors.stock}</p>
              {/if}
            </div>

            <div class="space-y-2">
              <label for="bonus" class="block text-sm font-medium text-gray-700">โบนัสต่อปี</label>
              <input
                id="bonus"
                type="text"
                inputmode="numeric"
                on:input={handleBonusInput}
                on:blur={handleBonusInput}
                class="w-full p-3 border rounded-lg transition-all duration-200
               {errors.bonus ? 'border-red-500' : 'border-gray-300'}"
                placeholder="ระบุโบนัส"
              />
              {#if errors.bonus}
                <p class="text-red-500 text-sm mt-1">{errors.bonus}</p>
              {/if}
            </div>
          </div>
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

<script lang="ts">
  import { newestEntry } from '../stores/salaryStore';
  import type { CompanySalary } from '../types/salary';
  export let salaryData: CompanySalary[];

  const itemsPerPage = 5;
  let currentPage = 1;

  const formatCurrency = (amount: string | number | null | undefined): string => {
    if (amount == null || amount === 'N/A') return '-';
    if (typeof amount === 'string') {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return '-';
      amount = numAmount;
    }
    return amount.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  function isNewEntry(company: string, position: string): boolean {
    return $newestEntry === `${company}-${position}`;
  }

  $: sortedSalaryData = [...salaryData].sort((a, b) => {
    const totalA = (Number(a.salary) || 0) + (Number(a.stock) || 0) + (Number(a.bonus) || 0);
    const totalB = (Number(b.salary) || 0) + (Number(b.stock) || 0) + (Number(b.bonus) || 0);
    return totalB - totalA;
  });

  $: totalPages = Math.ceil(sortedSalaryData.length / itemsPerPage);
  $: paginatedData = sortedSalaryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function generatePageNumbers(current: number, total: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if ((i === current - delta - 1 && i > 1) || (i === current + delta + 1 && i < total)) {
        pages.push('...');
      }
    }

    return [...new Set(pages)];
  }

  function goToPage(page: number) {
    currentPage = page;
  }
</script>

<div class="container mx-auto p-2 sm:p-4">
  <div class="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
    <table class="min-w-full bg-white text-sm sm:text-base">
      <thead>
        <tr class="bg-gradient-to-r from-[#0056a9] to-[#0066cc] text-white">
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold tracking-wider"
            >Company</th
          >
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold tracking-wider"
            >Level</th
          >
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold tracking-wider"
            >Tag</th
          >
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold tracking-wider"
            >Experience</th
          >
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold tracking-wider"
            >Total Compensation</th
          >
          <th
            class="px-3 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold tracking-wider"
            >Base Salary</th
          >
          <th
            class="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold tracking-wider"
            >Monthly Stock</th
          >
          <th
            class="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold tracking-wider"
            >Bonus</th
          >
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each paginatedData as { company, level, tag, experience, totalCompensation, salary, stock, bonus }, i}
          <tr
            class="transition-colors duration-200 {i % 2 === 0
              ? 'bg-white'
              : 'bg-slate-50/50'} {isNewEntry(company, level)
              ? 'bg-green-50 animate-pulse'
              : 'hover:bg-blue-50/50'}"
          >
            <td class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900"
              >{company}</td
            >
            <td class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{level}</td>
            <td class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{tag}</td>
            <td class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-700">{experience}</td>
            <td
              class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-right font-medium text-gray-900"
              >{formatCurrency(totalCompensation)}</td
            >
            <td
              class="px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-right font-medium text-gray-900"
              >{formatCurrency(salary)}</td
            >
            <td
              class="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-right font-medium text-gray-900"
              >{formatCurrency(stock)}</td
            >
            <td
              class="hidden sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-right font-medium text-gray-900"
              >{formatCurrency(bonus)}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div
    class="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 gap-4"
  >
    <div class="text-sm text-gray-700">
      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
        currentPage * itemsPerPage,
        sortedSalaryData.length,
      )} of {sortedSalaryData.length} entries
    </div>
    <div class="flex items-center gap-2">
      <button
        on:click={prevPage}
        disabled={currentPage === 1}
        class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 {currentPage ===
        1
          ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
        aria-label="Previous page"
      >
        ←
      </button>

      {#each generatePageNumbers(currentPage, totalPages) as page}
        {#if typeof page === 'string'}
          <span class="px-4 py-2 text-gray-700">{page}</span>
        {:else}
          <button
            on:click={() => goToPage(page)}
            class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 {currentPage ===
            page
              ? 'bg-[#0056a9] text-white border-[#0056a9]'
              : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
          >
            {page}
          </button>
        {/if}
      {/each}

      <button
        on:click={nextPage}
        disabled={currentPage === totalPages}
        class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 {currentPage ===
        totalPages
          ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
        aria-label="Next page"
      >
        →
      </button>
    </div>
  </div>
</div>

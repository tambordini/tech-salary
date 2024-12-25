<script lang="ts">
  import { newestEntry } from '../stores/salaryStore';
  import type { CompanySalary } from '../types/salary';
  export let salaryData: CompanySalary[];

  const itemsPerPage = 5;
  let currentPage = 1;

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '-';
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
    const totalA = (a.salary || 0) + (a.stock || 0) + (a.targetBonus || 0);
    const totalB = (b.salary || 0) + (b.stock || 0) + (b.targetBonus || 0);
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
      if (
        i === 1 || // First page
        i === total || // Last page
        (i >= current - delta && i <= current + delta) // Pages around current
      ) {
        pages.push(i);
      } else if (
        (i === current - delta - 1 && i > 1) || // Before current range
        (i === current + delta + 1 && i < total) // After current range
      ) {
        pages.push('...');
      }
    }

    return [...new Set(pages)]; // Remove duplicates
  }

  function goToPage(page: number) {
    currentPage = page;
  }
</script>

<div class="container mx-auto p-4">
  <div class="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
    <table class="min-w-full bg-white">
      <thead>
        <tr class="bg-gradient-to-r from-[#0056a9] to-[#0066cc] text-white">
          <th class="px-6 py-4 text-left text-sm font-semibold tracking-wider">Company</th>
          <th class="px-6 py-4 text-left text-sm font-semibold tracking-wider">Position</th>
          <th class="px-6 py-4 text-left text-sm font-semibold tracking-wider">Experience</th>
          <th class="px-6 py-4 text-right text-sm font-semibold tracking-wider">Base Salary</th>
          <th class="px-6 py-4 text-right text-sm font-semibold tracking-wider">Monthly Stock</th>
          <th class="px-6 py-4 text-right text-sm font-semibold tracking-wider">Bonus</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each paginatedData as { company, position, experience, salary, stock: monthlyStock, targetBonus }, i}
          <tr
            class="transition-colors duration-200 {i % 2 === 0
              ? 'bg-white'
              : 'bg-slate-50/50'} {isNewEntry(company, position)
              ? 'bg-green-50 animate-pulse'
              : 'hover:bg-blue-50/50'}"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{company}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{position}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{experience}</td>
            <td class="px-6 py-4 text-sm text-right font-medium text-gray-900"
              >{formatCurrency(salary)}</td
            >
            <td class="px-6 py-4 text-sm text-right font-medium text-gray-900"
              >{formatCurrency(monthlyStock)}</td
            >
            <td class="px-6 py-4 text-sm text-right font-medium text-gray-900"
              >{formatCurrency(targetBonus)}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mt-6 flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
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

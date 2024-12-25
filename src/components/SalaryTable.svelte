<script lang="ts">
  import type { CompanySalary } from '../types/salary';
  import { newestEntry } from '../stores/salaryStore';
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
  <div class="overflow-x-auto rounded-lg shadow-lg">
    <table class="min-w-full bg-white">
      <thead>
        <tr class="bg-[#0056a9] text-white">
          <th class="px-6 py-3 text-left text-sm font-semibold">Company</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Position</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Level</th>
          <th class="px-6 py-3 text-left text-sm font-semibold">Experience</th>
          <th class="px-6 py-3 text-right text-sm font-semibold">Base Salary</th>
          <th class="px-6 py-3 text-right text-sm font-semibold">Monthly Stock</th>
          <th class="px-6 py-3 text-right text-sm font-semibold">Bonus</th>
        </tr>
      </thead>
      <tbody>
        {#each paginatedData as { company, position, level, experience, salary, stock: monthlyStock, targetBonus }, i}
          <tr
            class="border-b last:border-b-0 transition-all duration-500 {i % 2 === 0
              ? 'bg-white'
              : 'bg-slate-50'} {isNewEntry(company, position)
              ? 'bg-green-100 animate-pulse'
              : 'hover:bg-[#0056a9]/5'}"
          >
            <td class="px-6 py-4 text-sm">{company}</td>
            <td class="px-6 py-4 text-sm">{position}</td>
            <td class="px-6 py-4 text-sm">{level}</td>
            <td class="px-6 py-4 text-sm">{experience}</td>
            <td class="px-6 py-4 text-sm text-right font-medium">{formatCurrency(salary)}</td>
            <td class="px-6 py-4 text-sm text-right font-medium">{formatCurrency(monthlyStock)}</td>
            <td class="px-6 py-4 text-sm text-right font-medium">{formatCurrency(targetBonus)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex flex-col sm:flex-row items-center justify-between px-4 gap-4">
    <div class="text-sm text-black">
      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
        currentPage * itemsPerPage,
        sortedSalaryData.length,
      )} of {sortedSalaryData.length} entries
    </div>
    <div class="flex items-center gap-2">
      <button
        on:click={prevPage}
        disabled={currentPage === 1}
        class="px-3 py-1 text-sm font-medium rounded-md border {currentPage === 1
          ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9]/5'}"
        aria-label="Previous page"
      >
        ←
      </button>

      {#each generatePageNumbers(currentPage, totalPages) as page}
        {#if typeof page === 'string'}
          <span class="px-3 py-1 text-black">{page}</span>
        {:else}
          <button
            on:click={() => goToPage(page)}
            class="px-3 py-1 text-sm font-medium rounded-md border {currentPage === page
              ? 'bg-[#0056a9] text-white border-[#0056a9]'
              : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9]/5'}"
          >
            {page}
          </button>
        {/if}
      {/each}

      <button
        on:click={nextPage}
        disabled={currentPage === totalPages}
        class="px-3 py-1 text-sm font-medium rounded-md border {currentPage === totalPages
          ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
          : 'bg-white text-[#0056a9] border-[#0056a9] hover:bg-[#0056a9]/5'}"
        aria-label="Next page"
      >
        →
      </button>
    </div>
  </div>
</div>

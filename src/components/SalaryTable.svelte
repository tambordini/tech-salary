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
</script>

<div class="container mx-auto p-4">
  <div class="overflow-x-auto rounded-lg shadow-lg">
    <table class="min-w-full bg-white">
      <thead>
        <tr class="bg-gray-800 text-white">
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
              : 'bg-gray-50'} {isNewEntry(company, position)
              ? 'bg-green-100 animate-pulse'
              : 'hover:bg-blue-50'}"
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

  <div class="mt-4 flex items-center justify-between px-4">
    <div class="text-sm text-gray-700">
      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
        currentPage * itemsPerPage,
        sortedSalaryData.length,
      )} of {sortedSalaryData.length} entries
    </div>
    <div class="flex space-x-2">
      <button
        on:click={prevPage}
        disabled={currentPage === 1}
        class="px-4 py-2 text-sm font-medium rounded-md {currentPage === 1
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
      >
        Previous
      </button>
      <button
        on:click={nextPage}
        disabled={currentPage === totalPages}
        class="px-4 py-2 text-sm font-medium rounded-md {currentPage === totalPages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
      >
        Next
      </button>
    </div>
  </div>
</div>

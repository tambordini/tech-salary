<script lang="ts">
  import type { CompanySalary } from '../types/salary';
  export let salaryData: CompanySalary[];

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount == null) return '-';
    return amount.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
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
        {#each salaryData as { company, position, level, experience, salary, stock: monthlyStock, targetBonus }, i}
          <tr
            class="border-b last:border-b-0 {i % 2 === 0
              ? 'bg-white'
              : 'bg-gray-50'} transition-colors hover:bg-blue-50"
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
</div>

<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onDestroy, onMount } from 'svelte';
  import { tooltip } from '../actions/tooltip';
  import { newestEntry } from '../stores/salaryStore';
  import type { CompanySalary } from '../types/salary';

  export let salaryData: CompanySalary[];

  let chart: Chart;
  let chartCanvas: HTMLCanvasElement;
  let resizeObserver: ResizeObserver;
  let isMobileView = false;

  const getColorForPosition = (position: string) => {
    const colors: { [key: string]: string } = {
      'Full Stack': '#FF6384',
      'API Development (Back-End)': '#36A2EB',
      'Distributed Systems (Back-End)': '#4BC0C0',
      'Software Engineering Manager': '#9966FF',
      CTO: '#FF9F40',
    };
    return colors[position] || '#FFCD56';
  };

  const processData = (data: CompanySalary[]) => {
    const groupedData = data.reduce(
      (acc, entry) => {
        const key = `${entry.experience}-${entry.position}`;
        if (!acc[key]) {
          acc[key] = {
            experience: parseFloat(entry.experience),
            position: entry.position,
            salaries: [],
            companies: new Set(),
          };
        }
        acc[key].salaries.push(entry.salary);
        acc[key].companies.add(entry.company);
        return acc;
      },
      {} as Record<
        string,
        { experience: number; position: string; salaries: number[]; companies: Set<string> }
      >,
    );

    return Object.values(groupedData).map((data) => ({
      x: data.experience,
      y: Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length),
      position: data.position,
      count: data.salaries.length,
      companies: Array.from(data.companies),
      minSalary: Math.min(...data.salaries),
      maxSalary: Math.max(...data.salaries),
    }));
  };

  const formatSalary = (salary: number) => salary.toLocaleString() + ' ฿';

  const getTableData = (data: CompanySalary[]) => {
    return processData(salaryData).sort((a, b) => b.y - a.y);
  };

  const checkMobileView = () => {
    isMobileView = window.innerWidth < 768;
  };

  onMount(() => {
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  });

  const initChart = () => {
    if (!chartCanvas || !salaryData) return;

    if (chart) chart.destroy();

    const processedData = processData(salaryData);
    const positions = [...new Set(processedData.map((d) => d.position))];

    chart = new Chart(chartCanvas, {
      type: 'scatter',
      data: {
        datasets: positions.map((position) => ({
          label: position,
          data: processedData.filter((d) => d.position === position),
          backgroundColor: getColorForPosition(position),
          borderColor: getColorForPosition(position),
          pointBackgroundColor: (context: { raw: any }) => {
            const point = context.raw as any;
            return $newestEntry === `${point.companies[0]}-${point.position}`
              ? '#10B981' // Green highlight color
              : getColorForPosition(position);
          },
          pointBorderColor: (context: { raw: any }) => {
            const point = context.raw as any;
            return $newestEntry === `${point.companies[0]}-${point.position}`
              ? '#059669' // Darker green border
              : getColorForPosition(position);
          },
          pointRadius: (context: { raw: any }) => {
            const point = context.raw as any;
            const baseSize = Math.sqrt(point.count) * 5;
            return $newestEntry === `${point.companies[0]}-${point.position}`
              ? baseSize * 1.5 // Bigger point for new entry
              : baseSize;
          },
          pointHoverRadius: (context: { raw: any }) => {
            const point = context.raw as any;
            return Math.sqrt(point.count) * 6;
          },
          pointStyle: 'circle',
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Tech Salaries Distribution',
            font: {
              size: 20,
              weight: 'bold',
            },
            padding: {
              top: 20,
              bottom: 30,
            },
            color: '#2c3e50',
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const point = ctx.raw as any;
                return [
                  `Position: ${point.position}`,
                  `Experience: ${point.x} years`,
                  `Average Salary: ${point.y.toLocaleString()} ฿`,
                  `Salary Range: ${point.minSalary.toLocaleString()} - ${point.maxSalary.toLocaleString()} ฿`,
                  `Number of Positions: ${point.count}`,
                  `Companies: ${point.companies.join(', ')}`,
                ];
              },
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 6,
          },
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { size: 12 },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Salary (THB/Month)',
              font: { size: 14, weight: 'bold' },
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              font: { size: 12 },
              padding: 8,
              callback: (value) => `${(value as number).toLocaleString()} ฿`,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Years of Experience',
              font: { size: 14, weight: 'bold' },
            },
            grid: {
              display: false,
            },
            ticks: {
              font: { size: 12 },
              padding: 8,
              stepSize: 1,
            },
          },
        },
      },
    });
  };

  const formatSalaryRange = (min: number, max: number) => {
    return `${formatSalary(min)} - ${formatSalary(max)}`;
  };

  const getCompanyPreview = (companies: string[]) => {
    if (companies.length <= 2) return companies.join(', ');
    return `${companies.slice(0, 2).join(', ')} +${companies.length - 2}`;
  };

  $: {
    if (chartCanvas && salaryData) {
      initChart();

      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          chart.resize();
          initChart();
        });
        resizeObserver.observe(chartCanvas);
      }
    }
  }

  // Re-render chart when newestEntry changes
  $: {
    if ($newestEntry) {
      initChart();
    }
  }

  onDestroy(() => {
    if (chart) chart.destroy();
    if (resizeObserver) resizeObserver.disconnect();
  });
</script>

<div class="w-full space-y-4">
  {#if isMobileView}
    <div class="space-y-4 px-4">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Tech Salaries Overview</h2>
      <div class="grid gap-4">
        {#each getTableData(salaryData) as row}
          <div
            class="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <div
                    class="w-4 h-4 rounded-full flex-shrink-0"
                    style="background-color: {getColorForPosition(row.position)}"
                  ></div>
                  <h3
                    class="font-semibold text-gray-800 truncate"
                    use:tooltip={{ content: row.position }}
                  >
                    {row.position}
                  </h3>
                </div>
                <span
                  class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm flex-shrink-0"
                >
                  {row.count} positions
                </span>
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Average Salary:</span>
                  <span class="text-lg font-bold text-green-600">{formatSalary(row.y)}</span>
                </div>

                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Experience:</span>
                  <span class="font-medium">{row.x} years</span>
                </div>

                <div class="pt-2 border-t">
                  <p class="text-sm text-gray-600">Salary Range:</p>
                  <p class="font-medium text-gray-800">
                    {formatSalaryRange(row.minSalary, row.maxSalary)}
                  </p>
                </div>

                <div class="pt-2">
                  <p class="text-sm text-gray-600">Companies:</p>
                  <p class="text-sm text-gray-800 line-clamp-1">
                    {getCompanyPreview(row.companies)}
                  </p>
                </div>
              </div>
            </div>

            {#if $newestEntry === `${row.companies[0]}-${row.position}`}
              <div class="bg-green-50 px-4 py-2 border-t border-green-100">
                <p class="text-sm text-green-600 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Newly Added
                </p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="h-[500px]">
      <canvas bind:this={chartCanvas}></canvas>
    </div>
  {/if}
</div>

<style>
  :global(.tippy-box) {
    background-color: #333;
    color: white;
    font-size: 0.875rem;
    padding: 4px 8px;
    border-radius: 4px;
  }

  :global(.tippy-arrow) {
    color: #333;
  }
</style>

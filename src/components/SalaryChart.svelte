<script lang="ts">
  import Chart from 'chart.js/auto';
  import type { CompanySalary } from '../types/salary';
  import { onDestroy } from 'svelte';
  import { newestEntry } from '../stores/salaryStore';

  export let salaryData: CompanySalary[];

  let chart: Chart;
  let chartCanvas: HTMLCanvasElement;
  let resizeObserver: ResizeObserver;

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

<div class="w-full h-[500px] space-y-4">
  <canvas bind:this={chartCanvas}></canvas>
</div>

<script lang="ts">
  import Chart from 'chart.js/auto';
  import type { CompanySalary } from '../types/salary';
  import { onDestroy } from 'svelte';

  export let salaryData: CompanySalary[];

  let chart: Chart;
  let chartCanvas: HTMLCanvasElement;
  let resizeObserver: ResizeObserver;

  const processData = (data: CompanySalary[]) => {
    // จัดกลุ่มข้อมูลตามประสบการณ์และตำแหน่ง
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

    // แปลงเป็นรูปแบบที่ Chart.js ต้องการ
    return Object.values(groupedData).map((data) => ({
      x: data.experience,
      y: Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length),
      r: data.salaries.length * 3, // ขนาดของ bubble แทนจำนวนตำแหน่งงาน
      companies: Array.from(data.companies),
      position: data.position,
    }));
  };

  const initChart = () => {
    if (!chartCanvas || !salaryData) return;

    if (chart) chart.destroy();

    const processedData = processData(salaryData);

    chart = new Chart(chartCanvas, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Tech Salaries',
            data: processedData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
            hoverBorderColor: 'rgba(54, 162, 235, 1)',
            hoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart',
        },
        plugins: {
          title: {
            display: true,
            text: 'Tech Salaries by Experience and Position',
            font: {
              size: 18,
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
                const data = ctx.raw as any;
                return [
                  `Average Salary: ${ctx.parsed.y.toLocaleString()} ฿`,
                  `Experience: ${ctx.parsed.x} years`,
                  `Position: ${data.position}`,
                  `Companies: ${data.companies.join(', ')}`,
                ];
              },
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            cornerRadius: 6,
          },
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Salary (THB/Month)',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              font: {
                size: 12,
              },
              padding: 8,
              callback: (value) => `${(value as number).toLocaleString()} ฿`,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Years of Experience',
            },
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
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

  onDestroy(() => {
    if (chart) chart.destroy();
    if (resizeObserver) resizeObserver.disconnect();
  });
</script>

<div class="w-full h-[400px] space-y-4">
  <canvas bind:this={chartCanvas}></canvas>
</div>

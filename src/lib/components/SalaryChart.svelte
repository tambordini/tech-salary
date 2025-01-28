<script lang="ts">
	import { newestEntry } from '$lib/stores/salaryStore';
	import type { CompanySalary } from '$lib/types/salary';
	import Chart from 'chart.js/auto';
	import annotationPlugin from 'chartjs-plugin-annotation';
	import { onDestroy, onMount } from 'svelte';

	Chart.register(annotationPlugin);

	export let salaryData: CompanySalary[];

	let chart: Chart;
	let chartCanvas: HTMLCanvasElement;
	let resizeObserver: ResizeObserver;
	let isMobileView = false;
	let chartContainer: HTMLDivElement;
	let containerWidth = 0;

	const checkMobileView = () => {
		isMobileView = window.innerWidth < 768;
	};

	onMount(() => {
		checkMobileView();
		window.addEventListener('resize', checkMobileView);

		const resizeObserver = new ResizeObserver((entries) => {
			containerWidth = entries[0].contentRect.width;
		});

		resizeObserver.observe(chartContainer);

		return () => {
			window.removeEventListener('resize', checkMobileView);
			resizeObserver.disconnect();
		};
	});

	$: maxTicksLimit = Math.max(6, Math.floor(containerWidth / 100));

	const calculateMedian = (salaries: number[]): number => {
		const sorted = [...salaries].sort((a, b) => a - b);
		const middle = Math.floor(sorted.length / 2);
		if (sorted.length % 2 === 0) {
			return (sorted[middle - 1] + sorted[middle]) / 2;
		}
		return sorted[middle];
	};

	const createSalaryBins = (salaries: number[], binCount = 15) => {
		const min = Math.min(...salaries);
		const max = Math.max(...salaries);
		const binWidth = (max - min) / binCount;
		const bins = new Array(binCount).fill(0);
		const binRanges: [number, number][] = [];

		for (let i = 0; i < binCount; i++) {
			const start = min + i * binWidth;
			const end = start + binWidth;
			binRanges.push([start, end]);
		}

		salaries.forEach((salary) => {
			const binIndex = Math.min(Math.floor((salary - min) / binWidth), binCount - 1);
			bins[binIndex]++;
		});

		return { bins, binRanges };
	};

	const initChart = () => {
		if (!chartCanvas || !salaryData) return;
		if (chart) chart.destroy();

		const allSalaries = salaryData.map((d) => d.salary);
		const medianSalary = calculateMedian(allSalaries);
		const { bins, binRanges } = createSalaryBins(allSalaries);

		const medianBinIndex = binRanges.findIndex(([start, end]) => {
			return medianSalary >= start && medianSalary <= end;
		});

		chart = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels: binRanges.map(
					([start, end]) =>
						`${Math.round(start).toLocaleString()} - ${Math.round(end).toLocaleString()}`
				),
				datasets: [
					{
						data: bins,
						backgroundColor: 'rgba(54, 162, 235, 0.5)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: ['Salary Distribution'],
						font: {
							size: 16,
							weight: 'bold'
						}
					},
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							title: (items) => `Salary Range: ${items[0].label} ฿`,
							label: (context) => `${context.parsed.y} entries`
						}
					},
					annotation: {
						annotations: {
							medianLine: {
								type: 'line',
								xScaleID: 'x',
								xMin: medianBinIndex - 0.5,
								xMax: medianBinIndex - 0.5,
								borderColor: 'rgba(255, 99, 132, 1)',
								borderWidth: 2,
								label: {
									display: true,
									content: `Median: ${medianSalary.toLocaleString()} ฿`,
									position: 'center'
								}
							}
						}
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Salary Range (THB)',
							font: { size: 14, weight: 'bold' }
						},
						ticks: {
							maxRotation: 45,
							minRotation: 45,
							maxTicksLimit
						}
					},
					y: {
						display: false,
						beginAtZero: true
					}
				}
			}
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

<div class="w-full space-y-4" bind:this={chartContainer}>
	<div class="h-[500px]">
		<canvas bind:this={chartCanvas}></canvas>
	</div>
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

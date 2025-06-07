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

	const calculateMedian = (salaries: number[]): number => {
		const sorted = [...salaries].sort((a, b) => a - b);
		const middle = Math.floor(sorted.length / 2);
		if (sorted.length % 2 === 0) {
			return (sorted[middle - 1] + sorted[middle]) / 2;
		}
		return sorted[middle];
	};

	const calculateMean = (salaries: number[]): number => {
		return salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
	};

	const calculatePercentile = (salaries: number[], percentile: number): number => {
		const sorted = [...salaries].sort((a, b) => a - b);
		const index = (percentile / 100) * (sorted.length - 1);
		const lower = Math.floor(index);
		const upper = Math.ceil(index);

		if (lower === upper) {
			return sorted[lower];
		}

		const weight = index - lower;
		return sorted[lower] * (1 - weight) + sorted[upper] * weight;
	};

	const calculateStats = (salaries: number[]) => {
		if (salaries.length === 0) return null;

		return {
			count: salaries.length,
			min: Math.min(...salaries),
			max: Math.max(...salaries),
			mean: calculateMean(salaries),
			median: calculateMedian(salaries),
			p25: calculatePercentile(salaries, 25),
			p75: calculatePercentile(salaries, 75),
			stdDev: Math.sqrt(
				salaries.reduce((sum, salary) => {
					const diff = salary - calculateMean(salaries);
					return sum + diff * diff;
				}, 0) / salaries.length
			)
		};
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

	function initChart() {
		if (!chartCanvas || salaryData.length === 0) return;

		if (chart) {
			chart.destroy();
		}

		createHistogramChart();
	}

	function createHistogramChart() {
		const allSalaries = salaryData.map((d) => d.salary);
		const stats = calculateStats(allSalaries);

		if (!stats) return;

		const { bins, binRanges } = createSalaryBins(allSalaries);

		chart = new Chart(chartCanvas, {
			type: 'bar',
			data: {
				labels: binRanges.map(
					([start, end]) => `฿${Math.round(start / 1000)}K-${Math.round(end / 1000)}K`
				),
				datasets: [
					{
						data: bins,
						backgroundColor: 'rgba(29, 78, 216, 0.7)',
						borderColor: 'rgba(29, 78, 216, 1)',
						borderWidth: 0,
						borderRadius: 4,
						borderSkipped: false
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: false
					},
					legend: {
						display: false
					},
					tooltip: {
						backgroundColor: 'rgba(15, 23, 42, 0.95)',
						titleColor: 'white',
						bodyColor: 'white',
						borderColor: 'rgba(29, 78, 216, 1)',
						borderWidth: 1,
						callbacks: {
							title: (items) => `ช่วง: ${items[0].label}`,
							label: (context) => `จำนวน: ${context.parsed.y} คน`,
							afterBody: (tooltipItems) => {
								const binIndex = tooltipItems[0].dataIndex;
								const [start, end] = binRanges[binIndex];
								const binSalaries = allSalaries.filter(
									(salary) => salary >= start && salary <= end
								);

								if (binSalaries.length === 0) return [];

								const binStats = calculateStats(binSalaries);
								if (!binStats) return [];

								return [
									`เฉลี่ยในช่วง: ฿${Math.round(binStats.mean).toLocaleString()}`,
									`${((binStats.count / stats.count) * 100).toFixed(1)}% ของทั้งหมด`
								];
							}
						}
					},
					annotation: {
						annotations: {
							medianLine: {
								type: 'line',
								scaleID: 'x',
								value: stats.median,
								borderColor: 'rgba(239, 68, 68, 0.8)',
								borderWidth: 2,
								label: {
									display: true,
									content: 'Median',
									position: 'end',
									backgroundColor: 'rgba(239, 68, 68, 0.1)',
									color: 'rgba(239, 68, 68, 1)',
									font: { size: 11 }
								}
							},
							meanLine: {
								type: 'line',
								scaleID: 'x',
								value: stats.mean,
								borderColor: 'rgba(168, 85, 247, 0.8)',
								borderWidth: 2,
								borderDash: [5, 5],
								label: {
									display: true,
									content: 'Mean',
									position: 'start',
									backgroundColor: 'rgba(168, 85, 247, 0.1)',
									color: 'rgba(168, 85, 247, 1)',
									font: { size: 11 }
								}
							}
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						border: {
							display: false
						},
						ticks: {
							color: 'rgba(71, 85, 105, 1)',
							font: { size: 11 },
							maxRotation: 0,
							maxTicksLimit: isMobileView ? 6 : 10
						}
					},
					y: {
						display: false,
						beginAtZero: true,
						grid: {
							display: false
						}
					}
				},
				layout: {
					padding: {
						top: 20,
						bottom: 10
					}
				}
			}
		});
	}

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

	$: if (chartCanvas && salaryData) {
		initChart();
	}

	onDestroy(() => {
		if (chart) chart.destroy();
		if (resizeObserver) resizeObserver.disconnect();
	});
</script>

<div class="w-full space-y-6" bind:this={chartContainer}>
	{#if salaryData.length > 0}
		{@const allSalaries = salaryData.map((d) => d.salary)}
		{@const stats = calculateStats(allSalaries)}

		{#if stats}
			<div class="stats-container rounded-xl border border-gray-200 bg-white p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">สถิติเงินเดือน</h2>
				<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
					<div class="stat-item">
						<div class="stat-label">จำนวนข้อมูล</div>
						<div class="stat-value text-green-600">{stats.count.toLocaleString()}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">ค่ากลาง (Median)</div>
						<div class="stat-value text-blue-600">฿{Math.round(stats.median).toLocaleString()}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">ค่าเฉลี่ย (Mean)</div>
						<div class="stat-value text-green-600">฿{Math.round(stats.mean).toLocaleString()}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">25th Percentile</div>
						<div class="stat-value text-gray-600">฿{Math.round(stats.p25).toLocaleString()}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">75th Percentile</div>
						<div class="stat-value text-gray-600">฿{Math.round(stats.p75).toLocaleString()}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">ช่วงเงินเดือน</div>
						<div class="stat-value text-gray-600">
							฿{Math.round(stats.min).toLocaleString()} - ฿{Math.round(stats.max).toLocaleString()}
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	<div class="rounded-xl border border-gray-200 bg-white p-6">
		<div class="h-[400px]">
			<canvas bind:this={chartCanvas}></canvas>
		</div>
	</div>
</div>

<style>
	.stats-container {
		box-shadow:
			0 1px 3px 0 rgba(0, 0, 0, 0.1),
			0 1px 2px 0 rgba(0, 0, 0, 0.06);
	}

	.stat-item {
		text-align: center;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.25;
	}

	@media (max-width: 768px) {
		.stat-value {
			font-size: 0.875rem;
		}

		.stat-label {
			font-size: 0.625rem;
		}
	}
</style>

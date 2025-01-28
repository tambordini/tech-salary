<script lang="ts">
	import { tagSkills as skillsData } from '$lib/data/tagSkillData';
	import type { TagSkill } from '$lib/types/tagSkill';

	let uniqueCompanies: TagSkill[] = [];
	let currentPage: number = 1;
	let itemsPerPage: number = 12;
	let totalItems: number = 0;
	let totalPages: number = 0;

	let selectedCompany: string | null = null;
	let selectedBenefits: string[] = [];
	let showModal = false;

	function prepareUniqueCompanies() {
		const seen = new Set();
		uniqueCompanies = skillsData.filter((item) => {
			if (seen.has(item.company)) {
				return false;
			}
			seen.add(item.company);
			return true;
		});
		totalItems = uniqueCompanies.length;
		totalPages = Math.ceil(totalItems / itemsPerPage);
	}

	function getBenefitsByCompany(companyName: string) {
		const company = uniqueCompanies.find((item) => item.company === companyName);
		return company ? company.benefits : [];
	}

	function openModal(companyName: string) {
		selectedCompany = companyName;
		selectedBenefits = getBenefitsByCompany(companyName);
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function getPaginatedItems() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return uniqueCompanies.slice(startIndex, startIndex + itemsPerPage);
	}

	function goToPage(page: number) {
		currentPage = page;
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
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

	prepareUniqueCompanies();
</script>

<div class="rounded-xl border border-gray-100 bg-white p-4 shadow-lg sm:p-8">
	<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
		{#each getPaginatedItems() as company}
			<button class="company-card" on:click={() => openModal(company.company)}>
				{company.company}
			</button>
		{/each}
	</div>

	{#if showModal}
		<div class="modal">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title">{selectedCompany}</h2>
					<button class="close-btn" on:click={closeModal}>x</button>
				</div>
				<h3 class="mb-3 text-lg font-medium">สวัสดิการ</h3>
				<ul>
					{#if selectedBenefits.length > 0}
						{#each selectedBenefits as benefit}
							<li class="benefit-item">- {benefit}</li>
						{/each}
					{:else}
						<li class="benefit-item">- ไม่มีข้อมูลสวัสดิการ</li>
					{/if}
				</ul>
				<button
					class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					on:click={closeModal}
				>
					Close
				</button>
			</div>
		</div>
	{/if}
</div>

<div class="mt-4 flex flex-col items-center justify-between gap-4 px-2 sm:mt-6 sm:flex-row sm:px-4">
	<div class="text-sm text-gray-700">
		Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
			currentPage * itemsPerPage,
			uniqueCompanies.length
		)} of {uniqueCompanies.length} entries
	</div>
	<div class="flex items-center gap-2">
		<button
			on:click={prevPage}
			disabled={currentPage === 1}
			class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 {currentPage ===
			1
				? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
				: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
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
					class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 {currentPage ===
					page
						? 'border-[#0056a9] bg-[#0056a9] text-white'
						: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
				>
					{page}
				</button>
			{/if}
		{/each}

		<button
			on:click={nextPage}
			disabled={currentPage === totalPages}
			class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 {currentPage ===
			totalPages
				? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
				: 'border-[#0056a9] bg-white text-[#0056a9] hover:bg-[#0056a9] hover:text-white'}"
			aria-label="Next page"
		>
			→
		</button>
	</div>
</div>

<style>
	.company-card {
		@apply cursor-pointer rounded-lg bg-gray-100 p-4 text-center font-semibold text-blue-500 shadow-md hover:bg-gray-200;
	}

	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50;
	}

	.modal-content {
		@apply w-full max-w-md rounded-lg bg-white p-6 shadow-lg;
	}

	.modal-header {
		@apply mb-4 flex items-center justify-between;
	}

	.modal-title {
		@apply text-xl font-semibold;
	}

	.close-btn {
		@apply cursor-pointer text-gray-600 hover:text-gray-800;
	}

	.benefit-item {
		@apply mb-2 text-gray-700;
	}
</style>

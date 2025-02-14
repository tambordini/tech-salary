<script lang="ts">
	import { tagSkills as skillsData } from '../data/tagSkillData';
	import type { TagSkill } from '../types/tagSkill';

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
		if (item.company === '') {
			return false;
		}

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

<div class="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100">
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
	  {#each getPaginatedItems() as company}
		<button class="company-card" on:click={() => openModal(company.company)}>
		  {company.company}
		</button>
	  {/each}
	</div>
  
	{#if showModal}
		<div class="modal">
			<div class="modal-content relative">
			<div class="modal-header">
				<h2 class="modal-title">{selectedCompany}</h2>
				<button class="close-btn" on:click={closeModal}>x</button>
			</div>
			<h3 class="text-lg font-medium mb-3">สวัสดิการ</h3>
			<ul class="benefit-list">
				{#if selectedBenefits.length > 0}
				{#each selectedBenefits as benefit}
					<li class="benefit-item">- {benefit}</li>
				{/each}
				{:else}
				<li class="benefit-item">- ไม่มีข้อมูลสวัสดิการ</li>
				{/if}
			</ul>
			<button
				class="absolute bottom-4 right-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				on:click={closeModal}
			>
				ปิด
			</button>
			</div>
		</div>
	{/if}
</div>
  
<div class="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 gap-4">
	<div class="text-sm text-gray-700">
	  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
		currentPage * itemsPerPage,
		uniqueCompanies.length,
	  )} of {uniqueCompanies.length} entries
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
  
<style>
	.company-card {
	  @apply bg-gray-100 text-blue-500 font-semibold text-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-200;
	}
  
	.modal {
	  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50;
	}
  
	.modal-content {
	  @apply bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-[80vh];
	}
  
	.modal-header {
	  @apply flex justify-between items-center mb-4;
	}
  
	.modal-title {
	  @apply text-xl font-semibold;
	}
  
	.close-btn {
	  @apply text-gray-600 hover:text-gray-800 cursor-pointer;
	}
  
	.benefit-item {
	  @apply text-gray-700 mb-2;
	}
  
	.benefit-list {
	  @apply overflow-y-auto border border-gray-200 rounded p-4 h-[58vh];
	}
</style>
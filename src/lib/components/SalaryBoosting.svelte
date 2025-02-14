<script lang="ts">
	import * as tf from '@tensorflow/tfjs';
	import * as use from '@tensorflow-models/universal-sentence-encoder';

	import { slide } from 'svelte/transition';
	import { tagSkills as skillsData } from '$lib/data/tagSkillData';
	import tagOptions from '$lib/data/tags.json';

	let suggestedSkills: string[] = [];
	let userJob = '';
	let yearsOfExperience: number | undefined = undefined;

	let errors: Record<string, string> = {};
	let isCalculated = false;
	let isLoading = false;

	function debounce<T extends (...args: any[]) => void>(
		fn: T,
		delay: number
	): (...args: Parameters<T>) => void {
		let timeoutId: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn(...args), delay);
		};
	}

	const debouncedValidateExperience = debounce((value: string) => {
		errors.experience = validateExperience(value);
	}, 100);

	function handleExperienceInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		yearsOfExperience = parseInt(value);
		debouncedValidateExperience(value);
	}

	function validateExperience(value: string) {
		const num = Number(value);
		if (!value) return 'กรุณาระบุประสบการณ์';
		if (num < 1) return 'ประสบการณ์ต้องไม่ต่ำกว่า 1 ปี';
		if (num > 50) return 'ประสบการณ์ต้องไม่เกิน 50 ปี';
		return '';
	}

	// Filter skills by position and experience
	function getSkillsByPositionAndExperience(tagName: string, yearsOfExperience: number) {
		const relevantSkills: string[] = [];
		skillsData.forEach((item) => {
			if (item.tag === tagName && item.yearsOfExperience <= yearsOfExperience) {
				relevantSkills.push(...item.requiredSkills);
			}
		});
		return Array.from(new Set(relevantSkills));
	}

	async function groupSimilarSkills(skills: string[]) {
		if (!skills || skills.length === 0) {
			return [];
		}

		const model = await use.load();
		const embeddings = await model.embed(skills);

		const similarityThreshold = 0.75;
		const groupedSkills = [];
		const visited = new Set();

		for (let i = 0; i < skills.length; i++) {
			if (visited.has(i)) continue;

			const group = [skills[i]];
			visited.add(i);

			for (let j = i + 1; j < skills.length; j++) {
				if (visited.has(j)) continue;
				const similarity = tf.tidy(() => {
					const embeddingI = tf.slice(embeddings, [i, 0], [1, embeddings.shape[1]]);
					const embeddingJ = tf.slice(embeddings, [j, 0], [1, embeddings.shape[1]]);
					const dotProduct = tf.matMul(embeddingI, embeddingJ, false, true);
					return dotProduct.arraySync()[0][0];
				});

				if (similarity > similarityThreshold) {
					group.push(skills[j]);
					visited.add(j);
				}
			}

			groupedSkills.push(group.join('  ◦  '));
		}

		return groupedSkills;
	}

	async function findSkills() {
		isLoading = true;
		isCalculated = false;
		const filteredSkills = getSkillsByPositionAndExperience(userJob, yearsOfExperience!);
		suggestedSkills = await groupSimilarSkills(filteredSkills);
		isLoading = false;
		isCalculated = true;
	}
</script>

<div class="rounded-xl border border-gray-100 bg-white p-4 shadow-lg sm:p-8">
	<div class="space-y-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label for="experiences" class="block text-sm font-medium text-gray-700">ตำแหน่งงาน</label>
				<select
					bind:value={userJob}
					class="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="" disabled selected>เลือกตำแหน่งงาน</option>
					{#each tagOptions as tag}
						<option value={tag}>{tag}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<label for="experiences" class="block text-sm font-medium text-gray-700"
					>ประสบการณ์ (ปี) *</label
				>
				<input
					id="year"
					type="number"
					min="1"
					max="50"
					step="1"
					on:input={handleExperienceInput}
					on:blur={handleExperienceInput}
					bind:value={yearsOfExperience}
					class="w-full rounded-lg border p-3 transition-all duration-200
          {errors.experience
						? 'border-red-500 focus:border-red-500 focus:ring-red-500'
						: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}"
					placeholder="ระบุจำนวนปี"
				/>
				{#if errors.experience}
					<p class="mt-1 text-sm text-red-500">{errors.experience}</p>
				{/if}
			</div>
		</div>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
			<button
				on:click={findSkills}
				class="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-medium
          text-white shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed
          disabled:opacity-50 sm:py-3"
			>
				ค้นหา
			</button>
		</div>

		{#if isLoading}
			<div
				transition:slide={{ duration: 300 }}
				class="from-blue-10 mt-6 rounded-xl border border-blue-200 bg-gradient-to-br to-blue-50 p-6"
			>
				<p>กำลังประมวลผล...</p>
			</div>
		{/if}

		{#if !isLoading && suggestedSkills.length > 0}
			<div
				transition:slide={{ duration: 300 }}
				class="mt-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8"
			>
				<ul class="list-disc">
					{#each suggestedSkills as skill}
						<li class="p-1">{skill}</li>
					{/each}
				</ul>
			</div>
		{:else if isCalculated}
			<div
				transition:slide={{ duration: 300 }}
				class="mt-6 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6"
			>
				<p>ไม่พบข้อมูล</p>
			</div>
		{/if}
	</div>
</div>

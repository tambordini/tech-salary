<script lang="ts">
  import { slide } from 'svelte/transition';
  import { tagSkills as skillsData } from '../data/tagSkillData';
  import tagOptions from '../data/tags.json';
  
  let suggestedSkills: string[] = [];
  let userJob = '';
  let userExperience: number | undefined = undefined;

  let errors: Record<string, string> = {};
  let isCalculated = false;


  function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  function handleExperienceInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    userExperience = parseInt(value);
    debouncedValidateExperience(value);
  }

  const debouncedValidateExperience = debounce((value: string) => {
    errors.experience = validateExperience(value);
  }, 100);

  function validateExperience(value: string) {
    const num = Number(value);
    if (!value) return 'กรุณาระบุประสบการณ์';
    if (num < 1) return 'ประสบการณ์ต้องไม่ต่ำกว่า 1 ปี';
    if (num > 50) return 'ประสบการณ์ต้องไม่เกิน 50 ปี';
    return '';
  }

  function formInvalid(): boolean {
    return Object.keys(errors).length > 0;
  }

  function findSkills() {
    const matchingSkills = skillsData.find(skill => skill.tag === userJob && skill.yearsOfExperience <= userExperience!);
    suggestedSkills = matchingSkills ? matchingSkills.requiredSkills : [];
    isCalculated = true;
  }
</script>
  
<div class="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-gray-100">
  <div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label for="experiences" class="block text-sm font-medium text-gray-700">ตำแหน่งงาน</label>
        <select 
          bind:value={userJob} 
          class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-200">
          <option value="" disabled selected>เลือกตำแหน่งงาน</option>
          {#each tagOptions as tag}
            <option value={tag}>{tag}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-2">
        <label for="experiences" class="block text-sm font-medium text-gray-700">ประสบการณ์ (ปี) *</label>
        <input
          id="year"
          type="number"
          min="1"
          max="50"
          step="1"
          on:input={handleExperienceInput}
          on:blur={handleExperienceInput}
          bind:value={userExperience}
          class="w-full p-3 border rounded-lg transition-all duration-200
          {errors.experience
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}"
          placeholder="ระบุจำนวนปี"
        />
        {#if errors.experience}
          <p class="text-red-500 text-sm mt-1">{errors.experience}</p>
        {/if}
      </div>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
      <button
        on:click={findSkills}
        disabled={ false }
        class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-3 px-6
          rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed"
      > ค้นหา
      </button>
    </div>

    {#if suggestedSkills.length > 0 }
      <div transition:slide={{ duration: 300 }}
        class="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
      >
        <ul>
          {#each suggestedSkills as skill}
            <li>{skill}</li>
          {/each}
        </ul>
      </div>
    {:else if isCalculated }
      <div transition:slide={{ duration: 300 }}
        class="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
      >ไม่พบข้อมูล
      </div>
    {/if}
  </div>
</div>
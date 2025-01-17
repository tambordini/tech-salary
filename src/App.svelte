<script lang="ts">
  import { onMount } from 'svelte';
  import { companySalaries } from './data/salaryData';
  import { customSalaries } from './stores/salaryStore';
  import SalaryChart from './components/SalaryChart.svelte';
  import SalaryTable from './components/SalaryTable.svelte';
  import SalaryCalculator from './components/SalaryCalculator.svelte';
  import SalaryBoosting from './components/SalaryBoosting.svelte';
  import Loading from './components/Loading.svelte';
  import OddsLogo from './assets/images/odds_logo.svg';

  let isLoading = true;
  $: combinedSalaryData = [...companySalaries, ...$customSalaries];

  onMount(() => {
    setTimeout(() => {
      isLoading = false;
    }, 1500);
  });
</script>

{#if isLoading}
  <Loading />
{:else}
  <main class="min-h-screen bg-gray-50 py-4">
    <div class="max-w-[1024px] mx-auto py-4 px-4 sm:py-8 sm:px-8">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-header text-white p-6 sm:p-12 bg-center bg-no-repeat bg-cover">
          <h1 class="text-xl sm:text-3xl font-bold text-center mb-4">
            การวิเคราะห์เงินเดือนวิศวกรซอฟต์แวร์ในประเทศไทย
          </h1>
          <div class="text-center text-gray-100">
            <p class="text-base sm:text-lg flex items-center justify-center">
              Powered By: <img src={OddsLogo} alt="ODDS Logo" class="h-4 sm:h-6 ml-2" />
            </p>
          </div>
        </div>

        <div class="p-4 sm:p-8">
          <section class="mb-8 sm:mb-12">
            <h2
              class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center"
            >
              <span class="mr-2">📊</span>
              บทคัดย่อ
            </h2>
            <p class="text-gray-600 leading-relaxed">
              งานวิจัยนี้วิเคราะห์การกระจายตัวของเงินเดือนวิศวกรซอฟต์แวร์ระดับอาวุโสในประเทศไทย
              โดยมุ่งเน้นที่แนวโน้มค่าตอบแทนสำหรับผู้เชี่ยวชาญที่มีประสบการณ์สูง
              ข้อมูลนี้แสดงให้เห็นภาพรวมของค่าตอบแทนวิศวกรอาวุโสในเทคโนโลยีและบริษัทต่างๆ
            </p>
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <span class="mr-2">🎯</span>
              คำนวณตำแหน่งเงินเดือนของคุณ
            </h2>
            <SalaryCalculator salaryData={combinedSalaryData} />
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <span class="mr-2">📈</span>
              การกระจายตัวของเงินเดือน
            </h2>
            <SalaryChart salaryData={combinedSalaryData} />
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <span class="mr-2">🏢</span>
              รายการเงินเดือนตามบริษัท
            </h2>
            <SalaryTable salaryData={combinedSalaryData} />
          </section>

          <section class="mb-12">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <span class="mr-2">🎯</span>
              ทักษะที่จำเป็นสำหรับตำแหน่งงาน
            </h2>
            <SalaryBoosting/>
          </section>
        </div>
      </div>
    </div>
  </main>
{/if}

<style>
  .bg-header {
    background-image: url('./assets/images/background_header.svg');
  }
</style>

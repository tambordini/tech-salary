<script lang="ts">
  import { companySalaries } from './data/salaryData';
  import { customSalaries } from './stores/salaryStore';
  import SalaryChart from './components/SalaryChart.svelte';
  import SalaryTable from './components/SalaryTable.svelte';
  import SalaryCalculator from './components/SalaryCalculator.svelte';

  $: combinedSalaryData = [...companySalaries, ...$customSalaries];
</script>

<main class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-[900px] mx-auto py-12 px-8">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-12">
        <h1 class="text-3xl font-bold text-center mb-4">
          การวิเคราะห์เงินเดือนวิศวกรซอฟต์แวร์ในประเทศไทย
        </h1>
        <div class="text-center text-gray-100">
          <p class="text-lg">Research : Bordin Intarama (Tam)</p>
        </div>
      </div>

      <div class="p-8">
        <section class="mb-12">
          <h2 class="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
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
      </div>
    </div>
  </div>
</main>

<style>
</style>

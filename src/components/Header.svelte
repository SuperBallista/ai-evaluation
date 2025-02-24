<header class="bg-main text-default border-b border-main-bg3 p-4 flex justify-between items-center">
    <div on:click={() => {viewMain.set(null)}} class="cursor-pointer text-xl font-bold">학생 평가 간소화 서비스</div>
    <nav class="flex space-x-4">
      <button on:click={() => {viewMain.set("subject")}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">교과관리</button>
      <button on:click={() => {viewMain.set("upload")}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">평가지관리</button>
      <button on:click={() => {viewMain.set("evaluation")}} class="cursor-pointer btn-default px-4 py-2 rounded-xl">학생평가</button>
    </nav>
  </header>
  <script lang="ts">
    import { viewMain } from "../lib/store/pageStore";

  </script>
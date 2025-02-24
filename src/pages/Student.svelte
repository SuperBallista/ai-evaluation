<script lang="ts">
    import { onMount } from "svelte";
    import { showMessageBox } from "../lib/custom/customStore";
    import { answerFormatType } from "../lib/type/answer";
    import NotFound from "./NotFound.svelte";

    let params = new URLSearchParams(window.location.search)
    let id = params.get("id");
    let session = params.get("session");
    let questions:{title:string,answerSheet:{format:answerFormatType,counts?:number}[]} = {title:"",answerSheet:[]}

    async function fetchQuestion() {
        if (!id || !session) 
        {
            showMessageBox("error","에러 발생", "평가지를 찾을 수 없습니다");
            return
        }
      try{
        const response = await fetch(`/api/question/answer?id=${id}&session=${session}`,{
          method:"GET",
        })

        if (response.status===200){
          showMessageBox("success","로딩 중", "답안지를 불러오고 있습니다")
          questions = await response.json()
        } else{
            const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
        }
      }
      catch (error) {
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
      }
    }
  
    onMount(() => {
(async () => {
await fetchQuestion()
})();
});

    

  </script>
  <svelte:head>
    <title>평가지 답안</title> 
   </svelte:head> 
{#if !id || !session}
<NotFound/>
{:else}
  <div class="max-w-3xl w-full mx-auto bg-main-bg3 shadow-lg rounded-lg p-6 mt-6">
    <h1 class="text-2xl font-semibold text-default mb-4">📄 {questions.title}</h1>
  
    <!-- ✅ 시험지 기본 정보 입력 -->
    <div class="mb-4">
      <label class="block text-default font-medium">번호</label>
      <select class="p-2 border border-gray-300 rounded-lg w-full mt-1">
        <option value="">번호 입력</option>
        {#each Array(50).fill(0) as _, i}
          <option value={i + 1}>{i + 1}</option>
        {/each}
      </select>
    </div>
  
    <div class="mb-4">
      <label class="block text-default font-medium">이름</label>
      <input type="text" class="p-2 border border-gray-300 rounded-lg w-full mt-1" placeholder="이름을 입력하세요" />
    </div>
  
    <hr class="border-main-bg2 my-4" />
  
    <!-- ✅ 동적으로 생성된 문제 입력 필드 -->
    {#each questions.answerSheet as question, index}
      <div class="mb-6 p-4 border rounded-lg bg-main-bg2">
        <label class="block text-default font-medium mb-2">문제 {index+1}</label>
  
        <!-- ✅ 선택형 (Select) -->
        {#if question.format === "select" && question.counts}
          <select class="p-2 border border-gray-300 rounded-lg w-full">
              {#each Array.from({ length: question.counts }, (_, i) => i + 1) as option}
                  <option value={option}>{option}</option>
              {/each}
          </select>
  
        <!-- ✅ 단답형 (Input) -->
        {:else if question.format === "input"}
          <input type="text" class="p-2 border border-gray-300 rounded-lg w-full" placeholder="정답 입력" />
  
        <!-- ✅ 서술형 (Textarea) -->
        {:else if question.format === "textarea"}
          <textarea class="p-2 border border-gray-300 rounded-lg w-full" rows="5" placeholder="서술형 정답 입력"></textarea>
        {/if}
      </div>
    {/each}
  
    <!-- ✅ 제출 버튼 -->
    <button class="cursor-pointer w-full text-default py-2 rounded-lg mt-4 btn-accent">
      제출하기
    </button>
  </div>
  {/if}
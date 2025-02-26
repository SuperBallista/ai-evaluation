<script lang="ts">
    import { onMount } from "svelte";
    import { showMessageBox } from "@lib/custom/customStore";
    import { answerFormatType } from "@lib/type/answer";
    import NotFound from "./NotFound.svelte";

    let params = new URLSearchParams(window.location.search)
    let id = params.get("id");
    let session = params.get("session");
    let questions:{title:string,answerSheet:{format:answerFormatType,counts?:number}[]} = {title:"",answerSheet:[]}
    let selectedStudent:number
    let studentList:{number:number, name:string}[] = []
    let answer: string[]=[];


    function findStudent(number:number){
     return studentList.find(item => item.number===number)
    }


    async function fetchStudent() {
      if (!session){
        return
      }
      try{
        const response = await fetch(`/api/student?session=${session}`,{
          method:"GET",
        })
        if (response.ok){
          studentList = await response.json()
        } else {
          const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
        }
      }catch (error) {
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
      }
      
    }

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

        if (response.ok){
          showMessageBox("success","로딩 중", "답안지를 불러오고 있습니다")
          questions = {...await response.json()}
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
await fetchQuestion();
await fetchStudent();
})();
});

async function fetchAnswer() {
  if (!id || !session || selectedStudent === undefined) {
    showMessageBox("error", "에러 발생", "필수 데이터가 부족합니다");
    return;
  }
  const fetchData = {
    questionsUuid: id,
    session,
    student:selectedStudent,
    answer
  };
try{
  const response = await fetch("/api/student/submit",{
    method:"POST",
    headers:{"Content-Type":"application/json"},

    body:JSON.stringify(fetchData)
  });
  if (response.ok){
    showMessageBox("success", "제출 성공", "답안이 성공적으로 제출되었습니다.");
  } else {
    const data = await response.json();
    showMessageBox("error", "제출 실패", data.message);
  }
} catch (error){
  showMessageBox("error", "서버 오류", "제출 중 오류 발생: " + error);
} 
}

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
      <label class="block text-default font-medium">반번호</label>
      <input type="number" bind:value={selectedStudent} class="p-2 border border-default-color  rounded-lg w-full mt-1"/>
      </div>
  
    <div class="mb-4">
      <span class="p-2 border border-default-color  rounded-lg w-full mt-1">
        {findStudent(selectedStudent)?.name || "반번호를 바르게 입력하세요"}
    </span>
        </div>
  
    <hr class=" my-4" />
  
    <!-- ✅ 동적으로 생성된 문제 입력 필드 -->
    {#each questions.answerSheet as question, index}
      <div class="mb-6 p-4 border border-default-color rounded-lg bg-main-bg2">
        <label class="block text-default font-medium mb-2">문제 {index+1}</label>
  
        <!-- ✅ 선택형 (Select) -->
        {#if question.format === "select" && question.counts}
          <select bind:value={answer[index]} class="p-2 border border-default-color  rounded-lg w-full">
              {#each Array.from({ length: question.counts }, (_, i) => i + 1) as option}
                  <option value={option}>{option}</option>
              {/each}
          </select>
  
        <!-- ✅ 단답형 (Input) -->
        {:else if question.format === "input"}
          <input bind:value={answer[index]} type="text" class="p-2 border border-default-color  rounded-lg w-full" placeholder="정답 입력" />
  
        <!-- ✅ 서술형 (Textarea) -->
        {:else if question.format === "textarea"}
          <textarea bind:value={answer[index]} class="p-2 border border-default-color  rounded-lg w-full" rows="5" placeholder="서술형 정답 입력"></textarea>
        {/if}
      </div>
    {/each}
  
    <!-- ✅ 제출 버튼 -->
    <button on:click={fetchAnswer} class="cursor-pointer w-full text-default py-2 rounded-lg mt-4 btn-accent">
      제출하기
    </button>
  </div>
  {/if}
<script lang="ts">
    import { closeMessageBox, messageType, showMessageBox } from "@lib/custom/customStore";
    import { selectedQuestionID, selectedStudents, students } from "@lib/store/evaluationStore";
    import { onMount } from "svelte";

    let studentFeedbacks:{name: string, number: number}[] = []
    let feedbackResult:string[] = []
    let completeFetch = 0
    let totalFetch = $selectedQuestionID.length + $selectedStudents.length

    async function requestFeedback() {
        if ($selectedStudents.length===0)
    {
        showMessageBox("alert","미입력 오류", "평가를 생성하려면 최소 한 명의 학생이 선택되어야 합니다")
        return}

        const fetchData = {
        students : $selectedStudents,
        question : $selectedQuestionID,
       }

   showMessageBox("loading","요청 진행중","학생 평가서 작성을 요청하고 있습니다") 
      
   try{
    let nextProcess = true
       for (const element of fetchData.question) {
   const success = await fetchQuestionInfo(element);
   if (!success) {nextProcess = false; break}
   completeFetch += 1
        }
        if (!nextProcess){return}

        for (const element of fetchData.students) {
   const success = await fetchStudentAnswerInfo(element);
   if (!success) {nextProcess = false; break}
        }
       completeFetch += 1
    } finally{
        if ($messageType==="loading") {closeMessageBox()}
    }


    }

async function fetchQuestionInfo(QuestionId:number) {
    try{
        const response = await fetch("/api/llm/question?id="+QuestionId,{
            method:"GET",
            credentials:"include"
        })
        if (response.ok){
            selectedQuestionID.update(selectedId => selectedId.filter(id => id != QuestionId));
            return true
        } else {
          const data = await response.json()
            showMessageBox("error","오류 발생", "문항 전송 중 오류가 발생하였습니다" + data.message)
            return false
        }
    } catch (error){
        showMessageBox("error", "에러 발생", "문항 전송 중 서버 오류가 발생하였습니다 :" + error)
        return false
    }
}

async function fetchStudentAnswerInfo(studentId:number) {
    try{
        const response = await fetch("/api/llm/student?id="+studentId, {
            method: "GET",
            credentials:"include"
        })
        if (response.ok){
           const data = await response.json()
           const thisStudent = $students.find(student => student.number === studentId)
           if (thisStudent){
            studentFeedbacks.push(thisStudent)
            selectedStudents.update(selectedId => selectedId.filter(id => id != studentId))
            feedbackResult.push(data)
            return true
        } else {
            showMessageBox("error","오류 발생", "답안 처리 중 오류가 발생하였습니다")
            return false
        }
        }   else {
          const data = await response.json()
            showMessageBox("error","오류 발생", "답안 전송 중 오류가 발생하였습니다" + data.message)
            return false
        }
    }
    catch (error){
        showMessageBox("error", "에러 발생", "답안 전송 중 서버 오류가 발생하였습니다 :" + error)
        return false
    }    
}

    
onMount(async () => {
    await requestFeedback(); // ✅ 이렇게도 실행됨.
});

</script>

<table class="table-auto w-full border-collapse border border-gray-300">
    <thead>
        <tr class="bg-sub3">
            <th class="px-4 py-2 border border-gray-300 text-left" style="width: 5%">번호</th>
            <th class="px-4 py-2 border border-gray-300 text-left" style="width: 15%">학생명</th>
            <th class="px-4 py-2 border border-gray-300 text-left" style="width: 80%">평가결과</th>
            </tr>
    </thead>
    <tbody>
        {#each studentFeedbacks as studentFeedback, index}
        <tr class="border border-gray-300">
            <td class="px-4 py-2 border border-gray-300">{studentFeedback.number}</td>
            <td class="px-4 py-2 border border-gray-300">{studentFeedback.name}</td>
            <td class="px-4 py-2 border border-gray-300">
                {#if feedbackResult[index]}
                    {feedbackResult[index]}
                {:else}
                    로딩 중입니다.
                {/if}
            </td>
        </tr>    
        {/each}
    </tbody>
</table>

<button on:click={()=>requestFeedback()} class="cursor-pointer w-full px-4 py-2 btn-accent rounded-lg mt-4">
    평가 생성 이어서 요청하기 (현재까지 {Math.floor(completeFetch / totalFetch * 100)}% 진행됨)
</button>

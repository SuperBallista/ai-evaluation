<script lang="ts">
    import SubjectSelector from "./SubjectSelector.svelte";
    import StudentList from "./StudentList.svelte";
    import Feedback from "./Feedback.svelte";
    import { selectedQuestionID, selectedStudents } from "@lib/store/evaluationStore";
    import { onMount } from "svelte";
    import { checkRemainTokens } from "@lib/store/userStore";
    let isFeedbackOpened = false

    function openFeedback(){
        isFeedbackOpened = true
    }
    let maxLength:number
    let remainingTokens:number

    
    onMount(() => {
        (async () => {
            remainingTokens = await checkRemainTokens();
        })();
    });


</script>

<div class="flex flex-col p-6 items-center justify-center min-h-screen">
    <div class="w-full mx-auto p-6 bg-main-bg3 shadow-md rounded-lg">
        <h1 class="text-2xl font-semibold mb-4">📄 학생 평가 생성</h1>

        <!-- ✅ 부모 div에 flex 추가 -->
        <div class="flex w-full gap-4 mt-6">
            <!-- ✅ 좌측 영역 (과목 선택) -->
            <div class="w-3/4">
                <SubjectSelector />
            </div>

            <!-- ✅ 우측 영역 (학생 리스트) -->
            <div class="w-1/4">
                <StudentList />
            </div>
        </div>
        <div class="flex items-center space-x-2">
            <span>길이</span>
            <input
            disabled={isFeedbackOpened}
            defaultValue="120" type="number"
            class="w-20 px-2 py-1 border border-default-color rounded-md"
            bind:value={maxLength}>
            <span>자 이상으로 작성을 요청합니다</span>
            <button
            on:click={openFeedback}
            disabled={$selectedQuestionID.length===0 || $selectedStudents.length===0}
            class="cursor-pointer px-4 py-2 btn-accent rounded-lg">평가 생성</button>
            남은 토큰 :{remainingTokens}개
        </div>
        {#if isFeedbackOpened}
        <Feedback {maxLength} bind:remainingTokens/>
        {/if}
        </div>
</div>

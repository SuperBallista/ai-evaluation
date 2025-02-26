<script lang="ts">
    import { showMessageBox } from "@lib/custom/customStore";
    import { onMount } from "svelte";
    import { defaultSubjects} from "@lib/store/userStore"
    import ExamList from "./ExamList.svelte";

    // ✅ 기본 과목 목록
    
    // ✅ 선택된 과목
    let selectedSubject: string = "";

    // ✅ 평가지 목록 (각 과목에 대한 평가 데이터)
    let ListData:{ id:number, title: string; date: Date }[] = [];


    async function fetchSubject() {
    try{
        const response = await fetch("/api/subject",{
            method: "GET",
            credentials: "include"
            })
            if (response.ok){
                const data:string[] = await response.json()
                defaultSubjects.set(data)
            }
            else {
                const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
            }               
    }    
    catch (error) {
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
    }

    async function showQuestionList() {
        if (selectedSubject === ""){ListData = []; return}
    try{
       const response = await fetch("/api/question/list/1/"+selectedSubject,{
        method:"GET",
        credentials:"include",
       })
       if (response.ok){
        const data:{questions_id:number, subjects_name:string, questions_title:string, questions_createdAt:string}[] = await response.json()
        
        ListData = data.filter((item) => item.questions_id !== null && item.questions_id !== undefined) // ✅ id가 없는 데이터 제외
        .map((item) => ({
    id: item.questions_id,
    title: item.questions_title,
    date: new Date(item.questions_createdAt)
}));
       } else {
        const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
       }
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
    }


    // ✅ onMount에서 비동기 함수 실행 (즉시 실행 함수 사용)
    onMount(() => {
        (async () => {
            await fetchSubject();
        })();
    });


</script>

        <h1 class="text-2xl font-bold text-default mb-4">과목 선택</h1>

        <!-- ✅ 과목 선택 및 입력 -->
        <div class="flex flex-col gap-3">
            <select bind:value={selectedSubject} on:change={showQuestionList} class="p-2 border border-default-color rounded-lg">
                <option value="">과목 선택</option>
                {#each $defaultSubjects as subject}
                    <option value={subject}>{subject}</option>
                {/each}
            </select>
     </div>
<ExamList ListData={ListData}/>
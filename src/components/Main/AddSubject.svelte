<script lang="ts">
    import { showMessageBox } from "../../lib/custom/customStore";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import SubjectQuestion from "./SubjectQuestion.svelte";

    // ✅ 기본 과목 목록
    const defaultSubjects = writable<string[]>([])
    
    // ✅ 선택된 과목
    let selectedSubject: string = $defaultSubjects[0];

    // ✅ 직접 입력하는 과목
    let customSubject: string = "";

    // ✅ 평가지 목록 (각 과목에 대한 평가 데이터)
    let ListData:{ id:number, title: string; date: Date }[] = [];


    async function fetchSubject() {
    try{
        const response = await fetch("/api/subject",{
            method: "GET",
            credentials: "include"
            })
            if (response.status===200){
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

    // ✅ 과목 추가 또는 수정
   async function addOrUpdateSubject(): Promise<void> {
    // 과목 추가
        if (selectedSubject.trim() === "기타" && customSubject.trim() !== "") {
            const fetchData = {name: customSubject}
            try{
                const response = await fetch("/api/subject",{
                    method:"POST",
                    credentials:"include",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(fetchData)
                })
                if (response.status===201){
                    const data:string[] = await response.json()
                    defaultSubjects.set(data)
                    showMessageBox("success","작업 성공","과목을 성공적으로 추가했습니다")
                } else {
                    const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
                }
            } catch (error){
                showMessageBox("error", "에러 발생", "서버 에러 :" + error)
            }

// 과목 수정
        } else if ($defaultSubjects.includes(selectedSubject)) {
            const fetchData = {selected:selectedSubject, name:customSubject}
            try{
                const response = await fetch("/api/subject",{
                    method:"PATCH",
                    credentials:"include",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(fetchData)
                })
                if (response.status===200){
                    const data:string[] = await response.json()
                    defaultSubjects.set(data)
                    showMessageBox("success","작업 성공","과목을 성공적으로 수정했습니다")
                } else {
                    const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
                }
            } catch (error){
                showMessageBox("error", "에러 발생", "서버 에러 :" + error)
            }
        }
    }

    // ✅ 과목 삭제
  async function removeSubject(subject: string): Promise<void> {
  const userResponse = await showMessageBox("confirm","삭제 확인", "과목을 삭제하겠습니까? 과목에 속한 평가지와 자료도 삭제됩니다")
  if (!userResponse.success) {
    return
  }
    const fetchData = {name: subject}
    try{
        const response = await fetch("/api/subject",{
            method:"DELETE",
            credentials:"include",
            headers: {
                        "Content-Type": "application/json" 
                    },
            body: JSON.stringify(fetchData)
        })
        if (response.status===200){
            const data:string[] = await response.json()
            defaultSubjects.set(data)
            showMessageBox("success","작업 성공","과목을 성공적으로 삭제했습니다")
        } else {
            const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
        }
    }catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
    }

    // ✅ onMount에서 비동기 함수 실행 (즉시 실행 함수 사용)
    onMount(() => {
        (async () => {
            await fetchSubject();
        })();
    });

    async function showQuestionList() {
    try{
       const response = await fetch("/api/question/list/1/"+selectedSubject,{
        method:"GET",
        credentials:"include",
       })
       if (response.status===200){
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


</script>

<div class="flex flex-col items-center justify-center min-h-screen p-6">
    <div class="max-w-lg w-full bg-main-bg3 shadow-md rounded-lg p-6">
        <h1 class="text-2xl font-bold text-default mb-4">과목 관리</h1>

        <!-- ✅ 과목 선택 및 입력 -->
        <div class="flex flex-col gap-3">
            <select bind:value={selectedSubject} on:change={showQuestionList} class="p-2 border rounded-lg">
                {#each $defaultSubjects as subject}
                    <option value={subject}>{subject}</option>
                {/each}
                <option value="기타">새로운 과목</option>
            </select>

                <input type="text" bind:value={customSubject} class="p-2 border rounded-lg" placeholder="새 과목명 입력 또는 선택한 과목명 수정" />

            <div class="flex gap-2">
                <button on:click={addOrUpdateSubject} class="cursor-pointer px-4 py-2 btn-default text-white rounded-lg">
                    추가 / 수정
                </button>
                <button on:click={() => removeSubject(selectedSubject)} class="cursor-pointer px-4 py-2 btn-accent text-white rounded-lg">
                    삭제
                </button>
            </div>
        </div>

        <!-- ✅ 추가된 과목 목록 -->
        <div class="mt-6">
            <h2 class="text-lg font-semibold text-default mb-2">등록된 과목:</h2>
            <ul class="flex flex-wrap gap-2">
                {#each $defaultSubjects as subject}
                    <li class="bg-sub3 text-default px-3 py-1 rounded-full shadow">{subject}</li>
                {/each}
            </ul>
        </div>
    </div>

<SubjectQuestion bind:ListData={ListData}/>
</div>

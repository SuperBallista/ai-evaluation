<script lang="ts">
    import AnswerForm from "./AnswerForm.svelte";
    import { showMessageBox } from "../../lib/custom/customStore";
    import { onMount } from "svelte";
    import mammoth from "mammoth";
    import { answerSheet, correctAnswer, editQuestion, viewMain } from "../../lib/store/pageStore";
    import { questionDataDto } from "../../lib/type/answer";


    // ✅ 파일 업로드 상태
    let file: File | null = null;
    let extractedText: string = $editQuestion?.content || "";

    function handleFileUpload(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            file = target.files[0];
            extractText();
        }
    }

    async function extractText(): Promise<void> {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async (event) => {
            if (!event.target) return;
            const arrayBuffer = event.target.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            extractedText = result.value;
        };
    }

    // ✅ 제목 입력 상태
    let title: string = $editQuestion?.title || "";

    // ✅ 과목 선택 상태
    let subjects:string[];
    let selectedSubject: string = "";

async function fetchSubject() {
    try{
        const response = await fetch("/api/subject",{
            method:"GET",
            credentials:"include",
        })
        const data = await response.json()
        if (response.status===200){
            subjects = data
        } else {
            const errorData = await response.json()
        showMessageBox("error","에러 발생", errorData.message);
        }
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
}

if ($editQuestion?.correctAnswer){
    correctAnswer.set($editQuestion?.correctAnswer)
}
    // ✅ 문제 갯수 설정
    let questionCount: number = $editQuestion?.answerSheet.length || 1;

    // ✅ 저장 버튼 클릭 이벤트
   async function saveData() {
    const fetchData:questionDataDto = {
        id: $editQuestion?.id || undefined,
        subjectName: selectedSubject,
        title: title,
        comment: "",
        content: extractedText,
        answerSheet: $answerSheet,
        correctAnswer: $correctAnswer
    }
    try{
        const response = await fetch("/api/question",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(fetchData)
        });
        if (response.status===201){
            showMessageBox("success","업로드 성공","업로드에 성공하였습니다!")
            viewMain.set(null)
            answerSheet.set([])
            correctAnswer.set([])
        } else {
            const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
        }
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
    }


    onMount(() => {

        (async () => {
            await fetchSubject();
            selectedSubject = $editQuestion?.subjectName || subjects[0]
        })();
    });


    
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-6">
    <div class="max-w-2xl w-full shadow-md rounded-lg p-6 bg-main-bg3">
        <h1 class="text-2xl font-bold text-default mb-4">문제 업로드 및 설정</h1>

        <!-- ✅ 파일 업로드 -->
        <div class="mb-4">
            <label class="block text-default font-medium">문제 파일 업로드(docx 형식)</label>
            <input type="file" accept=".docx" class="w-full mt-2 p-2 border rounded-lg" on:change={handleFileUpload} />
        </div>
        
        {#if extractedText}
        <div class="mb-4">
        <textarea bind:value={extractedText} rows=10 class="w-full p-2 border rounded-lg"></textarea>
        </div>
        {/if}
        <!-- ✅ 제목 입력 -->
        <div class="mb-4">
            <label class="block text-default font-medium">제목</label>
            <input type="text" bind:value={title} class="w-full mt-2 p-2 border rounded-lg" placeholder="시험 제목을 입력하세요" />
        </div>

        <!-- ✅ 과목 선택 -->
        <div class="mb-4">
            <label class="block text-default font-medium">과목 선택</label>
            <select bind:value={selectedSubject} class="w-full mt-2 p-2 border rounded-lg">
                {#each subjects as subject}
                    <option value={subject}>{subject}</option>
                {/each}
            </select>
        </div>

        <!-- ✅ 문제 갯수 설정 -->
        <div class="mb-4">
            <label class="block text-default font-medium">문제 갯수</label>
            <input type="number" bind:value={questionCount} min="1" class="w-full mt-2 p-2 border rounded-lg" />
        </div>

        <!-- ✅ 문항 입력 컴포넌트 -->
        <AnswerForm questionCount={questionCount}  />

        <!-- ✅ 저장 버튼 -->
        <button on:click={saveData} class="cursor-pointer w-full px-4 py-2 btn-accent rounded-lg mt-4">
            저장
        </button>
    </div>
</div>

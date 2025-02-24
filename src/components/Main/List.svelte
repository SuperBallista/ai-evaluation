<div class="flex flex-col items-center justify-center min-h-screen p-6">
<div class="max-w-2xl w-full bg-main-bg3 shadow-md rounded-lg p-6 mt-6">
    <h2 class="text-lg font-semibold text-default mb-4">등록된 평가지</h2>
    <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-sub3">
            <tr>
                <th class="border p-2">과목</th>
                <th class="border p-2">평가지 제목</th>
                <th class="border p-2">작성일</th>
                <th class="border p-2">풀기</th>
                <th class="border p-2">수정</th>
                <th class="border p-2">삭제</th>
            </tr>
        </thead>
        <tbody>
            {#each ListData as data}
                <tr>
                    <td class="border p-2">{data.subject}</td>
                    <td class="border p-2">{data.title}</td>
                    <td class="border p-2">{ checkDateTime(data.date) }</td>
                    <td class="border p-2 text-center">
                        <button on:click={() => openEvaluation(data.id)} class="cursor-pointer px-3 py-1 text-default rounded-md btn-accent">
                            풀기
                        </button>
                    </td>
                    <td class="border p-2 text-center">
                        <button on:click={() => editEvaluation(data.id)} class="cursor-pointer px-3 py-1 text-default rounded-md btn-default">
                            수정
                        </button>
                    </td>
                    <td class="border p-2 text-center">
                        <button on:click={() => deleteEvaluation(data.id)} class="cursor-pointer px-3 py-1 text-default rounded-md btn-default">
                            삭제
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
</div>
<script lang="ts">
    import { showMessageBox } from "../../lib/custom/customStore";
    import { checkDateTime } from "../../lib/date/formatDate";
    import { onMount } from "svelte";

    let ListData:{ id:number, title: string; date: Date, subject:string }[]

    // 평가 열기
    function openEvaluation(id:number) {
        console.log(`평가지 ${id} 열기`);
        // TODO: 페이지 이동 또는 모달 열기 기능 추가
    }

    // 평가 수정
    function editEvaluation(id:number) {
        console.log(`평가지 ${id} 수정`);
        // TODO: 수정 페이지로 이동 또는 모달 표시
    }

    // 평가 삭제
    function deleteEvaluation(id:number) {
        if (confirm("정말 삭제하시겠습니까?")) {
            console.log(`평가지 ${id} 삭제`);
            // TODO: 삭제 API 호출 및 목록 갱신
        }
    }

    async function showQuestionList() {
    try{
       const response = await fetch("/api/question/list/1",{
        method:"GET",
        credentials:"include",
       })
       if (response.status===200){
        const data:{questions_id:number, subjects_name:string, questions_title:string, questions_createdAt:string}[] = await response.json()
        ListData = data
    .filter((item) => item.questions_id !== null && item.questions_id !== undefined) // ✅ id가 없는 데이터 제외
    .map((item) => ({
        id: item.questions_id,
        title: item.questions_title,
        date: new Date(item.questions_createdAt),
        subject: item.subjects_name
    }));
       } else {
        const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);
       }
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
    }
    }

    onMount(() => {
        (async () => {
            await showQuestionList();
        })();
    });



</script>

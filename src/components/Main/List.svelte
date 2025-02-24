<script lang="ts">
    import { editQuestion, qrCode, viewMain } from "../../lib/store/pageStore";
    import { showMessageBox } from "../../lib/custom/customStore";
    import { checkDateTime } from "../../lib/date/formatDate";
    import { mount, onMount } from "svelte";
    import QRcode from "../../pages/teacher/QRcode.svelte";
    import StudentList from "./StudentList.svelte";

    let ListData:{ id:number, title: string; date: Date, subject:string }[]

    // 평가 열기
    async function openEvaluation(id: number) {
    try {
        const response = await fetch(`/api/question/qrcode?id=${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 200) {
            showMessageBox("success", "열기 성공", "QR코드를 생성하고 있습니다");

            const data: { url: string } = await response.json();
            qrCode.set(data.url)

            // ✅ 새 창(Popup) 열기
            const qrWindow = window.open("", "_blank", "width=400,height=400");

            if (!qrWindow) {
                showMessageBox("error", "에러 발생", "팝업이 차단되었습니다.");
                return;
            }

            // ✅ 새 창의 HTML 문서 설정
            qrWindow.document.write(`
                <html>
                <head>
                    <title>QR Code</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        #qrcode-container { text-align: center; }
                    </style>
                </head>
                <body>
                    <div id="qrcode-container"></div>
                </body>
                </html>
            `);
            qrWindow.document.close();

            // ✅ `setTimeout()`을 사용하여 DOM이 로드될 시간을 준 후 실행
            setTimeout(() => {
                const target = qrWindow.document.getElementById("qrcode-container");

                if (target) {
                    mount(QRcode, {
                        target,
                    });
                } else {
                    console.error("❌ `qrcode-container`를 찾을 수 없음");
                }
            }, 100);
        } else {
            const data: { message: string } = await response.json();
            showMessageBox("error", "에러 발생", data.message);
        }
    } catch (error) {
        showMessageBox("error", "에러 발생", "서버 에러 :" + error);
    }
}


// 평가 수정
  async  function editEvaluation(id:number) {
        try{
            const response = await fetch(`/api/question/edit/${id}`,{
                method: "GET",
                credentials: "include",
            });
            if (response.status===200){
                showMessageBox("success","자료 불러오기", "자료를 불러오고 있습니다")
             const data = await response.json()
             editQuestion.set(data);
             viewMain.set("upload");
            } else{
                const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
            }
        }
        catch (error){
            showMessageBox("error", "에러 발생", "서버 에러 :" + error)
        }
       

    }

    // 평가 삭제
 async function deleteEvaluation(id:number) {
    
    const userResponse = await showMessageBox("confirm","삭제 확인", "평가지를 삭제하시겠습니까?")
    if (!userResponse.success){return}
    try{
        const response = await fetch("/api/question",{
            method: "DELETE",
            credentials: "include",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({id})
        })
        if (response.status===200){ 
            showMessageBox("success","삭제 성공","평가지를 삭제하였습니다")
            ListData = [...ListData.filter(data => data.id !== id)];
        } else {
            const data:{message:string} = await response.json()
            showMessageBox("error","에러 발생", data.message);
        }
    }
    catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
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


<div class="flex flex-col items-center justify-center min-h-screen p-6">
    <StudentList/>
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

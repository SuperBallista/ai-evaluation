<script lang="ts">
    import { closeMessageBox, messageType, showMessageBox } from "@lib/custom/customStore";
    import { selectedQuestionID, selectedStudents, students } from "@lib/store/evaluationStore";
    import { checkRemainTokens } from "@lib/store/userStore";
    import { onMount } from "svelte";

    import { writable, get } from "svelte/store";

    // ✅ 반응형 writable store로 변경
export const studentFeedbacks = writable<{ name: string; number: number }[]>([]);
export const feedbackResult = writable<string[]>([]);


    let completeFetch = 0
    let totalFetch = $selectedQuestionID.length + $selectedStudents.length + 1
    export let maxLength:number
    export let remainingTokens:number
    

    async function requestFeedback() {
    if ($selectedStudents.length === 0) {
        showMessageBox("alert", "미입력 오류", "평가를 생성하려면 최소 한 명의 학생이 선택되어야 합니다");
        return;
    }

    // ✅ studentFeedbacks을 최신 selectedStudents 기반으로 업데이트
    studentFeedbacks.set($selectedStudents.map(studentId => {
        const student = $students.find(s => s.number === studentId);
        return student ? { name: student.name, number: student.number } : { name: "알 수 없음", number: studentId };
    }));

    // ✅ 초기 상태에서 평가 결과를 "로딩 중..."으로 설정
    feedbackResult.set(new Array(get(studentFeedbacks).length).fill("로딩 중..."));

    const fetchData = {
        students: [...$selectedStudents],
        question: [...$selectedQuestionID]
    };

    totalFetch = fetchData.question.length + fetchData.students.length + 1;
    showMessageBox("loading", "요청 진행중", `학생 평가서 작성을 요청하고 있습니다: 진행률 ${Math.floor(completeFetch / totalFetch * 100)}%`);

    let nextProcess = true;

    try {
        if (completeFetch === 0) {
            const success = await fetchBeforePrompt();
            if (!success) {
                nextProcess = false;
                return;
            }
        }

        for (const element of fetchData.question) {
            if (completeFetch >= totalFetch) break;
            const success = await fetchQuestionInfo(element);
            if (!success) continue;
            completeFetch += 1;
        }

        if (!nextProcess) return;

        for (const element of fetchData.students) {
            if (completeFetch >= totalFetch) break;
            const success = await fetchStudentAnswerInfo(element);
            if (!success) continue;
            completeFetch += 1;
        }

    } catch (error) {
        console.error("Error during requestFeedback:", error);
        showMessageBox("error", "오류 발생", "요청 처리 중 문제가 발생했습니다.");
    } finally {
        if ($messageType === "loading") {
            closeMessageBox();
        }

        try {
            remainingTokens = await checkRemainTokens();
        } catch (tokenError) {
            console.error("Error checking remaining tokens:", tokenError);
        }
    }
}

    async function fetchBeforePrompt() {
        try{
            const response = await fetch(`/api/llm?maxLength=${maxLength}`,{
                method: "GET",
                credentials: "include"
            })
            if (response.ok){
                return true
            } else {
                const data = await response.json()
                showMessageBox("error","오류 발생", data.message)
                return false
            }
        }
        catch (error){
        showMessageBox("error", "에러 발생", "사전 프롬프트 전송 중 서버 오류가 발생하였습니다 :" + error)
        return false
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
            showMessageBox("error","오류 발생", data.message)
            return false
        }
    } catch (error){
        showMessageBox("error", "에러 발생", "문항 전송 중 서버 오류가 발생하였습니다 :" + error)
        return false
    }
}


async function fetchStudentAnswerInfo(studentId: number) {
    try {
        const response = await fetch("/api/llm/student?id=" + studentId, {
            method: "GET",
            credentials: "include"
        });

        const contentType = response.headers.get("content-type") || "";
        if (!response.ok) {
            if (contentType.includes("application/json")) {
                const errorData = await response.json();
                showMessageBox("error", "오류 발생", errorData.message);
            } else {
                const errorText = await response.text();
                showMessageBox("error", "오류 발생", `서버 오류: ${errorText}`);
            }
            return false;
        }

        let data;
        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        studentFeedbacks.update(feedbacks => {
            const index = feedbacks.findIndex(student => student.number === studentId);
            if (index !== -1) {
                const newFeedbackResult = get(feedbackResult);
                newFeedbackResult[index] = data;
                feedbackResult.set(newFeedbackResult); // ✅ 반응형 업데이트
            }
            return feedbacks;
        });

        selectedStudents.update(selectedId => selectedId.filter(id => id !== studentId));
        return true;
    } catch (error) {
        showMessageBox("error", "에러 발생", "답안 전송 중 서버 오류가 발생하였습니다 :" + error);
        return false;
    }
}


onMount(() => {
    studentFeedbacks.set($selectedStudents.map(studentId => {
        const student = $students.find(s => s.number === studentId);
        return student ? { name: student.name, number: student.number } : { name: "알 수 없음", number: studentId };
    }));
});

</script>

<table class="table-auto w-full border-collapse border border-default-color">
    <thead class="bg-sub2">
        <tr class="hover-color">
            <th class="px-4 py-2 border border-default-color text-left" style="width: 5%">번호</th>
            <th class="px-4 py-2 border border-default-color text-left" style="width: 15%">학생명</th>
            <th class="px-4 py-2 border border-default-color text-left" style="width: 80%">평가결과</th>
        </tr>
    </thead>
    <tbody>
        {#each $studentFeedbacks as studentFeedback, index}
        <tr class="border border-default-color">
            <td class="px-4 py-2 border border-default-color">{studentFeedback.number}</td>
            <td class="px-4 py-2 border border-default-color">{studentFeedback.name}</td>
            <td class="px-4 py-2 border border-default-color">
                {$feedbackResult[index] || "로딩 중..."}
            </td>
        </tr>
        {/each}
    </tbody>
</table>

<button on:click={()=>requestFeedback()} class="cursor-pointer w-full px-4 py-2 btn-action rounded-lg mt-4">
    평가 생성 이어서 요청하기 (현재까지 {Math.floor(completeFetch / totalFetch * 100)}% 진행됨)
</button>

<script lang="ts">
    let selectedSubject = "";

    // ✅ 여러 명의 학생 선택을 위해 `Set` 사용
    let selectedStudents = new Set<number>();

    let subjects = ["수학", "국어", "영어"]; // 과목 리스트

    // ✅ 특정 과목의 평가지 목록 (체크박스 상태 추가)
    let exams = [
        { id: 1, name: "수학 중간고사", checked: true },
        { id: 2, name: "수학 기말고사", checked: true },
        { id: 3, name: "수학 쪽지시험", checked: true }
    ];

    // ✅ 최근에 클릭한 평가지 ID 저장
    let expandedExamId: number | null = null;

    // ✅ 학생 목록 (번호 포함)
    let students = [
        { number: 101, name: "김철수" },
        { number: 102, name: "이영희" },
        { number: 103, name: "박민수" }
    ];

    // ✅ 평가지별 문제 및 정답 데이터
    let examDetails: Record<number, { 문제: string; 정답: string; 해설: string }[]> = {
        1: [{ 문제: "문제 1", 정답: "정답1", 해설: "정답1 설명" }],
        2: [{ 문제: "문제 1", 정답: "정답A", 해설: "정답A 설명" }],
        3: [{ 문제: "문제 1", 정답: "정답X", 해설: "정답X 설명" }]
    };

    // ✅ 체크박스 상태 변경
    function toggleExamSelection(id: number) {
        exams = exams.map(exam =>
            exam.id === id ? { ...exam, checked: !exam.checked } : exam
        );
    }

    // ✅ 평가지 클릭 시: 최근 클릭한 하나만 표시
    function toggleExamDetail(id: number) {
        expandedExamId = expandedExamId === id ? null : id; // 같은 거 클릭하면 닫힘
    }

    // ✅ 여러 학생 선택 가능하게 `Set`으로 저장
    function toggleStudentSelection(number: number) {
        if (selectedStudents.has(number)) {
            selectedStudents.delete(number); // 이미 선택된 학생이면 제거
        } else {
            selectedStudents.add(number); // 선택되지 않았다면 추가
        }
        selectedStudents = new Set(selectedStudents); // 반응형 업데이트
    }
</script>
<div class="flex flex-col p-6 items-center justify-center min-h-screen">

<div class="w-full mx-auto p-6 bg-main-bg3 shadow-md rounded-lg">
    <h1 class="text-2xl font-semibold mb-4">📄 학생 답안 조회</h1>

    <!-- ✅ 과목 선택 -->
    <div class="mb-4">
        <label class="block text-default font-medium">과목 선택</label>
        <select bind:value={selectedSubject} class="w-full p-2 border rounded-lg">
            <option value="">과목을 선택하세요</option>
            {#each subjects as subject}
                <option value={subject}>{subject}</option>
            {/each}
        </select>
    </div>

    <!-- ✅ 평가지 & 학생 목록 -->
    {#if selectedSubject}
    <div class="flex gap-4 mt-6">
        <!-- ✅ 평가지 목록 (왼쪽 3/4 크기) -->
        <div class="w-3/4">
            <h2 class="text-lg font-semibold text-default mb-2">{selectedSubject} 평가지 선택</h2>
            <table class="w-full border-collapse border border-gray-300">
                <thead class="bg-main-bg2">
                    <tr>
                        <th class="border p-2 text-center">선택</th>
                        <th class="border p-2">평가지</th>
                    </tr>
                </thead>
                <tbody>
                    {#each exams as exam}
                        <tr>
                            <!-- ✅ 체크박스 (사용자 활성화 가능) -->
                            <td class="border p-2 text-center">
                                <input type="checkbox" on:change={() => toggleExamSelection(exam.id)} checked={exam.checked} />
                            </td>
                            <!-- ✅ 평가지 이름 클릭 시 문제 확장 -->
                            <td class="border p-2 cursor-pointer"
                                on:click={() => toggleExamDetail(exam.id)}>
                                {exam.name}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>

            <!-- ✅ 평가지 자세히 보기: 최근에 선택한 하나만 -->
            {#if expandedExamId !== null}
            <div class="mt-4 p-4 border rounded-lg">
                <h3 class="text-lg font-semibold">{exams.find(e => e.id === expandedExamId)?.name} - 문제 상세</h3>
                <table class="w-full border-collapse border mt-2">
                    <thead class="bg-main-bg2">
                        <tr>
                            <th class="border p-2">문제</th>
                            <th class="border p-2">정답</th>
                            <th class="border p-2">해설</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each examDetails[expandedExamId] as detail}
                            <tr>
                                <td class="border p-2">{detail.문제}</td>
                                <td class="border p-2">{detail.정답}</td>
                                <td class="border p-2">{detail.해설}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            {/if}
        </div>

        <!-- ✅ 학생 목록 (오른쪽 1/4 크기) -->
        <div class="w-1/4">
            <h2 class="text-lg font-semibold text-default mb-2">📌 학생 선택</h2>
            <table class="w-full border-collapse border border-gray-300">
                <thead class="bg-main-bg2">
                    <tr>
                        <th class="border p-2">번호</th>
                        <th class="border p-2">학생</th>
                    </tr>
                </thead>
                <tbody>
                    {#each students as student}
                        <tr>
                            <td class="border p-2 text-center">{student.number}</td>
                            <!-- ✅ 학생 선택 시 색상 변경 -->
                            <td class="border p-2 text-center cursor-pointer"
                            class:text-default={selectedStudents.has(student.number)}
                            class:font-bold={selectedStudents.has(student.number)}
                            class:text-mute={!selectedStudents.has(student.number)}
                            on:click={() => toggleStudentSelection(student.number)}>
                            {student.name}
                        </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    {/if}
</div>
</div>
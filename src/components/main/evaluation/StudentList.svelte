<script lang="ts">
    import { onMount } from "svelte";
    import { selectedStudents, students} from "@lib/store/evaluationStore";
    import { teacherInfo } from "@lib/store/userStore";
    import { showMessageBox } from "@lib/custom/customStore";
    import { studentDto } from "@lib/type/answer";




    function toggleStudentSelection(number: number) {
        if ($selectedStudents.includes(number)){
            selectedStudents.update(students => students.filter(item => item !== number));
        }else{
        selectedStudents.update((students) => [...students, number]);
    }
    }
  

    async function fetchData() {
try{
    const response = await fetch("/api/student?id="+$teacherInfo,{
        credentials:"include",
        method:"GET"
    })
    if(response.ok){
   const allStudentList:studentDto[] = await response.json() || []
   students.set(allStudentList)
   selectedStudents.set(allStudentList.map(item => item.number))
    }  else{
        const errorData = await response.json()
        showMessageBox("error","에러 발생", errorData.message);
    }
}  catch (error){
    showMessageBox("error", "에러 발생", "서버 에러 :" + error)
} 
}

        // ✅ onMount에서 비동기 함수 실행 (즉시 실행 함수 사용)
        onMount(() => {
        (async () => {
            await fetchData();
        })();
    });

</script>

<h2 class="text-lg font-semibold text-default mb-2">📌 학생 선택</h2>
<table class="w-full border-collapse border border-gray-300">
    <thead class="bg-main-bg2">
        <tr>
            <th class="border p-2">번호</th>
            <th class="border p-2">학생</th>
        </tr>
    </thead>
    <tbody>
        {#each $students as student}
            <tr>
                <td class="border p-2 text-center">{student.number}</td>
                <td class="border p-2 text-center cursor-pointer"
                    class:text-default={$selectedStudents.includes(student.number)}
                    class:font-bold={$selectedStudents.includes(student.number)}
                    class:text-mute={!$selectedStudents.includes(student.number)}
                    on:click={() => toggleStudentSelection(student.number)}>
                    {student.name}
                </td>
            </tr>
        {/each}
    </tbody>
</table>

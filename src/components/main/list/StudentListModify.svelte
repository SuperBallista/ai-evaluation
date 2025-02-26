<script lang="ts">
    import { studentDto } from "@lib/type/answer";
    import { showMessageBox } from "@lib/custom/customStore";
    import { teacherInfo } from "@lib/store/userStore";
    import { onMount } from "svelte";

let allStudentList:studentDto[] = []

async function fetchData() {
try{
    const response = await fetch("/api/student?id="+$teacherInfo,{
        credentials:"include",
        method:"GET"
    })
    if(response.ok){
    allStudentList = await response.json() || []
    }  else{
        const errorData = await response.json()
        showMessageBox("error","에러 발생", errorData.message);
    }
}  catch (error){
    showMessageBox("error", "에러 발생", "서버 에러 :" + error)
} 
}

async function saveData() {
try{
    const response = await fetch("/api/student?id="+$teacherInfo,{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(allStudentList)
    })
    if (response.ok){
        showMessageBox("success","저장 성공","학생 명단 저장에 성공하였습니다")
    } else{
        const errorData = await response.json()
        showMessageBox("error","에러 발생", errorData.message);
    }
} catch (error){
    showMessageBox("error", "에러 발생", "서버 에러 :" + error)
}    
}


function deleteStudent(number:number) {
    allStudentList = [...allStudentList.filter((item => item.number!==number))]
} 
function addStudent() {
    const lastNumber = allStudentList.length > 0 ? Math.max(allStudentList[allStudentList.length - 1].number, 0) + 1 : 1;
    allStudentList = [...allStudentList, { name: "", number: lastNumber }];
}


onMount(() => {
(async () => {
   await fetchData()
})();
});


</script>


<div class="max-w-2xl w-full bg-main-bg3 shadow-md rounded-lg p-6 mt-6">
    <h2 class="text-lg font-semibold text-default mb-4">평가 학생 명단</h2>
    <table class="w-full border-collapse border border-default-color ">
        <thead class="bg-sub2">
            <tr class="hover-color">
                <th class=" border border-default-color p-2">번호</th>
                <th class=" border border-default-color p-2">이름</th>
                <th class=" border border-default-color p-2">삭제</th>
            </tr>
        </thead>
        <tbody>
            {#each allStudentList, i}
            <tr class="hover-color">
                <td class=" border border-default-color p-2">
                    <input type="number" min=1 bind:value={allStudentList[i].number} class="w-full p-1 border border-default-color rounded text-center" />
                </td>
                <td class=" border border-default-color p-2">
                    <input type="text" bind:value={allStudentList[i].name} class="w-full p-1 border border-default-color rounded" />
                </td>
                <td class=" border border-default-color p-2">
                    <button on:click={() => {deleteStudent(allStudentList[i].number)}} class="btn-default text-default px-4 py-2 rounded-lg cursor-pointer">삭제</button>
                </td>
            </tr>
        {/each}
    </tbody>
    </table>
        <button on:click={addStudent} class="w-full btn-default px-4 py-2 rounded-lg cursor-pointer">학생추가</button>
        <button on:click={saveData} class="w-full btn-action px-4 py-2 rounded-lg cursor-pointer">변경사항 저장</button>
</div>

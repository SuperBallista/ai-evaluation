<!-- ✅ 평가지 테이블 -->
    <h2 class="text-lg font-semibold text-default mb-4">평가지 목록</h2>
    <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-sub3">
            <tr>
                <th class="border p-2">평가지 제목</th>
                <th class="border p-2">작성일</th>
                <th class="border p-2">반영여부</th>
            </tr>
        </thead>
        <tbody>
            {#each ListData as data, index}
                <tr>
                    <td class="border p-2">
                    {data.title}</td>
                    <td class="border p-2">{checkDateTime(data.date) }</td>
                    <td class="border p-2 text-center">
                    <input type="checkbox" on:click={() => inputQuestionID(index)} bind:checked={$checkedData[index]} />
                </tr>
            {/each}
        </tbody>
    </table>

<script lang="ts">
    import { checkDateTime } from "@lib/date/formatDate";
    import { checkedData, selectedQuestionID } from "@lib/store/evaluationStore";

   export let ListData:{ id:number, title: string; date: Date }[]
 

   function inputQuestionID(i: number) {
    selectedQuestionID.update(selectedIDs => {
        const id = ListData[i].id;
        if ($checkedData[i]) {
            if (!selectedIDs.includes(id)) {
                return [...selectedIDs, id]; // 중복 방지
            }
        } else {
            return selectedIDs.filter(item => item !== id);
        }
        return selectedIDs;
    });
}



function updateCheckedData(length: number) {
    checkedData.set(new Array(length).fill(true)); // ✅ 새로운 배열 생성
}

// 예제: ListData가 변경될 때 CheckedData를 업데이트
$: if (ListData) {
    updateCheckedData(ListData.length);
    selectedQuestionID.set(ListData.map(item => item.id))
}

</script>

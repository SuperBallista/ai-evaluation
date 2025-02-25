<script lang="ts">
    import { answerFormatType } from "@lib/type/answer";
    import { answerSheet, correctAnswer, editQuestion } from "@lib/store/pageStore";
    import { onMount } from "svelte";

    export let questionCount: number;

    export function changeAnswer() {
        answerSheet.update(() => 
            answerFormats.map((format, i) => ({
                format,
                counts: choiceCounts[i] ?? 2 // ✅ 기본값 2 보장
            }))
        );
        console.log("🔄 변경된 answerSheet:", $answerSheet);
        correctAnswer.update(() => modelAnswers);
    }

    let answerFormats: answerFormatType[] = $editQuestion?.answerSheet.map(item => item.format) || Array(questionCount).fill("select");
    let choiceCounts: number[] = $editQuestion?.answerSheet.map(item => item.counts) || Array(questionCount).fill(2); // ✅ 기본값 2로 설정
    let choices: number[][] = [...Array(questionCount)].map((_, i) => 
    [...Array(choiceCounts[i] || 2)].map((_, j) => j + 1)
    );
    let modelAnswers: string[] = $editQuestion?.correctAnswer || Array(questionCount).fill("");

    function updateAnswerFormat(index: number, event: Event): void {
        const target = event.target as HTMLSelectElement;
        if (!target) return;

        modelAnswers[index] = "";
        changeAnswer();
    }

    function updateChoiceCount(index: number, event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!target) return;

        let count = parseInt(target.value, 10);
        count = isNaN(count) || count < 2 ? 2 : count; // ✅ 최소값 2 보장

        choiceCounts[index] = count;
        
        // ✅ 먼저 choices를 업데이트한 후 changeAnswer() 호출
        choices[index] = Array.from({ length: count }, (_, i) => i + 1);
        modelAnswers[index] = ""; 
        changeAnswer();
    }

    onMount(() => {
        changeAnswer();
    });
</script>

<div class="mb-6">
    <h2 class="text-lg font-semibold text-default mb-2">문제별 답안 형식</h2>
    {#each Array(questionCount) as _, index}
        <div class="flex flex-col gap-2 mb-4">
            <label class="text-default font-medium">문제 {index + 1}</label>
            
            <select bind:value={answerFormats[index]} class="p-2 border rounded-lg" on:change={(event) => updateAnswerFormat(index, event)}>
                <option value="select">선택형</option>
                <option value="input">단답형</option>
                <option value="textarea">서술형</option>
            </select>

            {#if answerFormats[index] === "select"}
                <div class="flex gap-2 items-center">
                    <label class="text-default font-medium">선택지 개수</label>
                    <input type="number" min="2" max="10" bind:value={choiceCounts[index]} class="p-2 border rounded-lg w-20"
                        on:change={(event) => updateChoiceCount(index, event)} />
                </div>

                <select on:change={() =>changeAnswer()} bind:value={modelAnswers[index]} class="p-2 border rounded-lg">
                    <option value="">정답 선택</option>
                    {#each choices[index] as choice}
                        <option value={choice}>{choice}</option>
                    {/each}
                </select>
            {/if}

            {#if answerFormats[index] === "input"}
                <input type="text" on:change={()=>changeAnswer()} bind:value={modelAnswers[index]} class="p-2 border rounded-lg" placeholder="정답 입력" />
            {/if}

            {#if answerFormats[index] === "textarea"}
                <textarea  on:change={()=>changeAnswer()} bind:value={modelAnswers[index]} class="p-2 border rounded-lg" rows="3" placeholder="서술형 정답 입력"></textarea>
            {/if}
        </div>
    {/each}
</div>

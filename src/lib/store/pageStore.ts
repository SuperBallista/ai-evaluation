import { writable } from "svelte/store";
import { answerInterface, correctAnswerType, questionDataDto } from "../type/answer";


export const qrCode = writable<string | null>(null)
export const viewMain = writable<"subject" | "upload" | "evaluation" | null>(null)


export const answerSheet = writable<answerInterface[]>([])
export const correctAnswer = writable<correctAnswerType[]>([])

export const editQuestion = writable<questionDataDto | null>(null)

export function cleanText(input: string | undefined) {
    if (input) {
        return input
            .replace(/[!?.,~😊ㅎ]+/g, '')  // 불필요한 특수문자 제거
            .replace(/[ \t]+/g, ' ')  // 연속된 공백(스페이스, 탭) 하나로 정리
            .replace(/\n{2,}/g, '\n')  // 연속된 줄바꿈은 하나로 줄이기
            .trim();  // 앞뒤 공백 제거
    } else {
        return "";
    }
}

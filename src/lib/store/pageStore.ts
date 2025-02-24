import { writable } from "svelte/store";
import { answerInterface, correctAnswerType, questionDataDto } from "../type/answer";


export const qrCode = writable<string | null>(null)
export const viewMain = writable<"subject" | "upload" | "evaluation" | null>(null)


export const answerSheet = writable<answerInterface[]>([])
export const correctAnswer = writable<correctAnswerType[]>([])

export const editQuestion = writable<questionDataDto | null>(null)

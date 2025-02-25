// src/stores.ts
import { writable, derived } from "svelte/store";
import { questionListDto, studentDto } from "../type/answer";

// ✅ 선택된 과목
export const selectedSubject = writable<string>("");

// ✅ 선택된 평가지 ID
export const expandedExamId = writable<number | null>(null);

// ✅ 평가지 목록
export const exams = writable<questionListDto[]>([]);

// ✅ 학생 목록
export const students = writable<studentDto[]>([]);

export const selectedStudents = writable<number[]>([]);

export const checkedData = writable<boolean[]>([]);

export const selectedQuestionID = writable<number[]>([]);
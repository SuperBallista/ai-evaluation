import { writable } from "svelte/store";


export const teacherInfo = writable<number | null>(null)

export const defaultSubjects = writable<string[]>([])

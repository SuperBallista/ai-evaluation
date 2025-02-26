import { showMessageBox } from "@lib/custom/customStore";
import { writable } from "svelte/store";


export const teacherInfo = writable<number | null>(null)

export const defaultSubjects = writable<string[]>([])


export async function checkRemainTokens() {
    try{
        const response = await fetch("/api/llm/usages",{
            method:"GET",
            credentials:"include"
        })
        if (response.ok){
            const data:number = await response.json()
            return data
        } else{
            const errorData = await response.json()
            showMessageBox("error","에러 발생", errorData.message);
            return 0
        }
    }
    catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
        return 0
    }
}

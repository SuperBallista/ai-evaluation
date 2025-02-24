<script lang="ts">
    import Login from "./teacher/Login.svelte";
    import {teacherInfo} from "../lib/store/userStore" 
    import TeacherAdmin from "./teacher/TeacherAdmin.svelte";
    import { showMessageBox } from "../lib/custom/customStore";
    import { onMount } from "svelte";

    async function checkSession() {
        try{
            const response = await fetch("/api/login",{
                method:"GET",
                credentials:"include"
            })
            if (response.status===200){
                const data = await response.json()
                teacherInfo.set(data.userId)
            } else{
                const errorData = await response.json()
                    showMessageBox("error","에러 발생", errorData.message);}
    } catch (error){
        showMessageBox("error", "에러 발생", "서버 에러 :" + error)
        }       
    }

    onMount(() => {
(async () => {
await checkSession();
})();
});




</script>

{#if $teacherInfo}
    <TeacherAdmin/>
{:else}
<Login/>
{/if}
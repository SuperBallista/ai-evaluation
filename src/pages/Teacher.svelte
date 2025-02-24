<script lang="ts">
    import Login from "./teacher/Login.svelte";
    import {teacherInfo} from "../lib/store/userStore" 
    import TeacherAdmin from "./teacher/TeacherAdmin.svelte";

</script>

{#if $teacherInfo}
    <TeacherAdmin/>
{:else}
<Login/>
{/if}
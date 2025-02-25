<script lang="ts">
    import { viewMain } from "@lib/store/pageStore";
    import Header from "@components/Header.svelte";
    import AddSubject from "@components/main/subject/AddSubject.svelte";
    import Upload from "@components/main/upload/Upload.svelte";
    import Evaluation from "@components/main/evaluation/Evaluation.svelte";
    import List from "@components/main/list/List.svelte";


</script>

<header>
<Header/>
</header>

<main class="bg-main-bg1">
{#if $viewMain==="subject"}
<AddSubject/>
{:else if $viewMain ==="upload"}
<Upload/>
{:else if $viewMain === "evaluation"}
<Evaluation/>
{:else}
<List/>
{/if}   
</main>



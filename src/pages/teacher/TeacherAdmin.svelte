<script lang="ts">
    import { viewMain } from "../../lib/store/pageStore";
    import Header from "../../components/Header.svelte";
    import AddSubject from "../../components/Main/AddSubject.svelte";
    import Upload from "../../components/Main/Upload.svelte";
    import Evaluation from "../../components/Main/Evaluation.svelte";
    import List from "../../components/Main/List.svelte";


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



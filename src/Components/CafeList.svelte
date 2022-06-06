<script lang="ts">
    import { fade } from "svelte/transition"
    import { SearchResultsStore } from "../Stores/SearchResults"
    let display: boolean

    SearchResultsStore.subscribe((results) => {
        display = results.length > 0
    })
</script>

{#if display}
    <div in:fade={{ duration: 150 }} class="results-container">
        <h2>Available Cafes</h2>
        <ul>
            {#each $SearchResultsStore as cafe (cafe.googleData.place_id)}
                <li
                    style="--results-display:{display};--random-solid:{cafe
                        .metadata.color.solid};--random-trans:{cafe.metadata
                        .color.transparent}"
                >
                    {cafe.metadata.avgDistance} Km - {cafe.googleData.name}
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .results-container {
        position: absolute;
        z-index: 100;
        bottom: 10px;
        left: 10px;
        padding: 13px;
        width: 350px;
        max-height: 650px;
        background-color: #c0c0c0c0;
        border-radius: 20px;
        overflow: none;
    }
    h2 {
        margin: 0px;
    }
    ul {
        margin: 0px;
        padding-left: 0;
    }
    ul > li {
        margin: 3px 0px;
        padding: 2px;
        list-style-type: none;
        border: 1px solid var(--random-solid);
        background-color: var(--random-trans);
        border-radius: 2px;
    }
</style>

<script>
    import { scale, fade } from "svelte/transition";
    import { SearchResultsStore } from "../Stores/SearchResults";
</script>

<div in:fade={{ duration: 100 }} class="results-container">
    <h2>Available Cafes</h2>
    <ul>
        {#each $SearchResultsStore as cafe (cafe.place_id)}
            <li in:scale out:scale>{cafe.name} - {cafe.vicinity}</li>
        {/each}
    </ul>
</div>

<style>
    .results-container {
        position: absolute;
        z-index: 100;
        bottom: 10px;
        left: 10px;
        padding: 0 13px;
        width: 400px;
        height: 600px;
        background-color: #c0c0c0c0;
        border-radius: 20px;
    }
</style>

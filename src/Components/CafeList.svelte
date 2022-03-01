<script>
    import { SearchResultsStore } from "../Stores/SearchResults";
</script>

<div class="map-container">
    <h2>Available Cafes</h2>
    <ul>
        {#each $SearchResultsStore as cafe (cafe.place_id)}
            <li>{cafe.name} - {cafe.vicinity}</li>
        {/each}
    </ul>
</div>

<style>
    .map-container {
        position: absolute;
        z-index: 100;
        bottom: 10px;
        left: 10px;
        width: 400px;
        height: 600px;
        background-color: #c0c0c0c0;
        border-radius: 20px;
    }
</style>

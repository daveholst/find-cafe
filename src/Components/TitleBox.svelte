<script lang="ts">
    import { get } from "svelte/store"

    import { fade, scale } from "svelte/transition"
    import { FriendsArrayStore } from "../Stores/FriendsArray"
    import { SearchResultsStore } from "../Stores/SearchResults"
    import { SelectedCafeStore } from "../Stores/SelectedCafe"
    import type { Coordinate } from "../utils"
    export let searchCircle: google.maps.Circle
    let flipper = true

    function resetMap() {
        // change flipper to trigger animation
        flipper = !flipper
        // remove search Circle from map
        searchCircle.setMap(null)

        // remove friends array markers from map and reset store
        FriendsArrayStore.update((farray) => {
            farray.map((f) => f.marker.setMap(null))
            return []
        })
        // remove cafe pins from map
        get(SearchResultsStore).map((cafe) => cafe.marker.setMap(null))
        // reset results store
        SearchResultsStore.set([])
        // reset selected cafe
        SelectedCafeStore.set(undefined)
    }
</script>

<div class="header">
    <h1>🧙‍♀️which-cafe</h1>
    <!-- this is a tad hacky... it just watches for the car to change
    and deletes and adds the component to the dock, trigger the animation -->
    {#key flipper}
        <div class="reset-button" on:click={resetMap} in:scale>
            <p>RESET</p>
        </div>
    {/key}
</div>

<style>
    .header {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
        top: 10px;
        left: 10px;
        right: 10px;
        padding: 13px;
        height: 40px;
        /* max-height: 200px; */
        background-color: #c0c0c0c0;
        border-radius: 20px;
    }
    h1 {
        margin: 0;
        font-size: 3rem;
        font-weight: 800;
    }
    .reset-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 100%;
        background-color: red;
        border-radius: 6px;
        font-weight: 700;
    }
    .reset-button:hover {
        cursor: pointer;
        color: white;
    }
</style>

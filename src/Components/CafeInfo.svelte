<script lang="ts">
    import { fade } from "svelte/transition"
    import type { SearchResult } from "../Stores/SearchResults"
    import { SelectedCafeStore } from "../Stores/SelectedCafe"
    import { SearchResultsStore } from "../Stores/SearchResults"
    import { matchResult } from "../utils"
    import { get } from "svelte/store"
    import { now } from "svelte/internal"
    let display: boolean
    // export let cafeInfo: SearchResult

    let selectedCafeInfo: SearchResult | undefined
    SelectedCafeStore.subscribe((location) => {
        if (location) {
            // display the container
            const cafeResultsList = get(SearchResultsStore)
            selectedCafeInfo = matchResult(location, cafeResultsList)
            display = true
        } else {
            display = false
        }
    })
    console.log("cafe info", selectedCafeInfo)
</script>

{#if display && selectedCafeInfo}
    <div
        class="info-container"
        style="--display:{display};--border-color:{selectedCafeInfo?.metadata
            .color.solid};--bg-color:{selectedCafeInfo?.metadata.color.trans90}"
        in:fade={{ duration: 150 }}
    >
        <div class="info">
            <h2>
                {selectedCafeInfo?.googleData.name}{selectedCafeInfo?.googleData
                    .price_level
                    ? " - " +
                      "$".repeat(selectedCafeInfo?.googleData.price_level)
                    : ""}
            </h2>
            <a
                target="_blank"
                href={`http://www.google.com/search?q=${selectedCafeInfo.googleData.name}&btnI`}
                >Let me Google that...
            </a>
            <p>{selectedCafeInfo.googleData.vicinity}</p>
            <p>
                <em>Rating: </em><span
                    >{selectedCafeInfo.googleData.rating}</span
                >
            </p>
        </div>
    </div>
{/if}

<style>
    .info-container {
        position: absolute;
        z-index: 100;
        bottom: 10px;
        right: 10px;
        padding: 13px;
        width: 350px;
        max-height: 650px;
        border: solid 5px var(--border-color);
        background-color: var(--bg-color);
        border-radius: 20px;
        overflow: none;
    }

    h2 {
        margin: 10px 0;
    }

    p {
        font-weight: 600;
    }
</style>

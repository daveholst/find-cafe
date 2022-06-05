<script lang="ts">
    //   import mapStyles from "./map-styles"; // optional
    import { onMount } from "svelte"
    import CafeList from "./CafeList.svelte"
    import { SearchResultsStore } from "../Stores/SearchResults"
    import { drawCircle, addMarker, Coordinate } from "../utils"
    import { get } from "svelte/store"
    import { searchDraw } from "../handlers/searchDraw"

    // adding friends to map
    let container
    onMount(async () => {
        let searchCircle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            radius: 500,
        })
        const friendsArray: Coordinate[] = []
        // build the map
        const map = new google.maps.Map(container, {
            zoom: 13, // initial zoom level
            center: { lat: -31.9523, lng: 115.8613 }, // Perth CBD
            disableDefaultUI: true,
        })

        // cerate place lookup
        const searchService = new google.maps.places.PlacesService(map)

        // This event listener calls addMarker() when the map is clicked.
        google.maps.event.addListener(map, "click", async (event) => {
            // clear markers from map and clear store
            get(SearchResultsStore).map((cafe) => cafe.marker.setMap(null))
            SearchResultsStore.set([])
            // add friend marker and push to array
            friendsArray.push(addMarker(event.latLng, map))
            // draw/update circle
            drawCircle(friendsArray, searchCircle, map)
            // search for cafes, update store and draw pins
            searchDraw({ friendsArray, searchService, map })
        })
    })
</script>

<div class="full-screen" bind:this={container} />
<CafeList />

<style>
    .full-screen {
        position: absolute;
        width: 100vw;
        height: 100vh;
    }
</style>

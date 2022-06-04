<script lang="ts">
    //   import mapStyles from "./map-styles"; // optional
    import { onMount } from "svelte"
    import CafeList from "./CafeList.svelte"
    import { SearchResultsStore } from "../Stores/SearchResults"
    import { SearchMarkersStore } from "../Stores/SearchMarkers"
    import {
        getCenter,
        getRadius,
        averageDistance,
        drawCircle,
        addMarker,
    } from "../utils"

    let container
    let map: google.maps.Map

    let friendsArray = []

    let service: google.maps.places.PlacesService

    let searchCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        // center: wan,
        radius: 500,
    })

    // adding friends to map

    onMount(async () => {
        // build the map - pretty sure all config has to happen in here
        map = new google.maps.Map(container, {
            zoom: 13, // initial zoom level
            // TODO maybe use the loation API to propogate this??
            center: { lat: -31.9523, lng: 115.8613 }, // Perth CBD
            disableDefaultUI: true,
            //   styles: mapStyles, // optional
        })
        // cerate place lookup
        service = new google.maps.places.PlacesService(map)

        // This event listener calls addMarker() when the map is clicked.
        google.maps.event.addListener(map, "click", async (event) => {
            // clear out the results store
            SearchResultsStore.set([])
            // remove the previous searches markers
            $SearchMarkersStore.map((marker) => marker.setMap(null))

            // add marker to map and add to friends array
            friendsArray.push(addMarker(event.latLng, map))

            // draw/update circle
            drawCircle(friendsArray, searchCircle, map)

            const searchCenterPoint = getCenter(friendsArray)
            const cafeRequest: google.maps.places.PlaceSearchRequest = {
                location: searchCenterPoint,
                radius: getRadius(searchCenterPoint, friendsArray) || 500, // meters
                type: "cafe",
            }
            // Search logic
            //TODO abstract this out
            if (friendsArray.length > 1) {
                service.nearbySearch(cafeRequest, (results, status) => {
                    console.log(status)
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results)
                        // add to store
                        SearchResultsStore.update(() =>
                            results.map((r) => ({ result: r }))
                        )
                    }
                })
            }
        })
    })

    // when results goto the store, drop pins
    SearchResultsStore.subscribe((cafes) => {
        cafes.map((cafe) => {
            const resultLocation = cafe.result.geometry.location
            const marker = new google.maps.Marker({
                position: resultLocation,
                animation: google.maps.Animation.DROP,
                map: map,
            })
            // TODO get this into the above, it's a bit haky
            const avgDistance =
                averageDistance({
                    from: marker,
                    to: friendsArray,
                }).toFixed(1) || undefined

            marker.setLabel(avgDistance)

            SearchMarkersStore.update((current) => [...current, marker])
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

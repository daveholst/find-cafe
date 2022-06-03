<script lang="ts">
    //   import mapStyles from "./map-styles"; // optional
    import { onMount } from "svelte"
    import CafeList from "./CafeList.svelte"
    import { SearchResultsStore } from "../Stores/SearchResults"
    import { SearchMarkersStore } from "../Stores/SearchMarkers"
    import {
        Coordinate,
        getCenter,
        getRadius,
        haversineDistance,
    } from "../utils"
    import { drawCircle } from "../utils/googleMaps"

    let container
    let map: google.maps.Map

    let zoom = 13
    let center = { lat: -31.9523, lng: 115.8613 }
    let wan = { lat: -31.9118, lng: 115.8126 }

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let labelIndex = 0

    let friendsArray = []

    let service

    let searchCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        center: wan,
        radius: 500,
    })
    //This has to exist here otherwise google is undefined
    export class CustomResultsMarker extends google.maps.Marker {
        public averageDistance: number
        setAverageDistance(friendsArray: Coordinate[]) {
            const markerLocation: Coordinate = {
                lat: this.getPosition().lat(),
                lng: this.getPosition().lng(),
            }
            // build distance to each friend
            const distances = friendsArray.map((friendLocation) =>
                haversineDistance(markerLocation, friendLocation)
            )

            this.averageDistance =
                distances.reduce((a, b) => a + b, 0) / distances.length
        }
        getAverageDistance() {
            return this.averageDistance
        }
    }
    // adding friends to map
    function addMarker(
        location: google.maps.LatLng,
        map: google.maps.Map
    ): void {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        new CustomResultsMarker({
            position: location,
            label: labels[labelIndex++ % labels.length],
            map: map,
        })
        friendsArray.push({ lat: location.lat(), lng: location.lng() })
    }

    onMount(async () => {
        // build the map - pretty sure all config has to happen in here
        map = new google.maps.Map(container, {
            zoom,
            center,
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

            let cafeRequest = {
                location: {},
                radius: "500", // meters
                type: ["cafe"],
            }
            addMarker(event.latLng, map)
            const calculatedCenter = await getCenter(friendsArray)
            cafeRequest.location = calculatedCenter
            const calculatedRadius = getRadius(calculatedCenter, friendsArray)
            cafeRequest.radius = calculatedRadius.toString()
            drawCircle(friendsArray, searchCircle, map)
            // Search logic
            //TODO abstract this out
            service.nearbySearch(cafeRequest, (results, status) => {
                console.log(status)
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results)
                    // add to store
                    SearchResultsStore.update(() => results)
                }
            })
        })
    })

    // when results goto the store, drop pins
    SearchResultsStore.subscribe((results) => {
        results.forEach((result) => {
            const resultLocation = result.geometry.location
            const marker = new CustomResultsMarker({
                position: resultLocation,
                animation: google.maps.Animation.DROP,
                label: "",
                map: map,
            })
            marker.setAverageDistance(friendsArray)
            const distanceKm = Math.floor(
                marker.averageDistance / 1000
            ).toString()
            marker.setLabel(distanceKm)
            // setMarkerColor(marker, friendsArray)
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

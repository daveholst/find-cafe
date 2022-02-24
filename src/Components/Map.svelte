<script>
    //   import mapStyles from "./map-styles"; // optional
    import { onMount } from "svelte";

    let container;
    let map;
    let zoom = 13;
    let center = { lat: -31.9523, lng: 115.8613 };
    let wan = { lat: -31.9118, lng: 115.8126 };

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let labelIndex = 0;

    let friendsArray = [];

    let friendsShape;

    friendsShape = new google.maps.Polygon({
        paths: friendsArray,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });

    function addMarker(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        new google.maps.Marker({
            position: location,
            label: labels[labelIndex++ % labels.length],
            map: map,
        });
        friendsArray.push({ lat: location.lat(), lng: location.lng() });
        if (friendsArray.length > 1) {
            // whipe existing polygon
            friendsShape.setMap(null);
            // build polygon
            friendsShape = new google.maps.Polygon({
                paths: friendsArray,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
            });
            // apply to map
            friendsShape.setMap(map);
        }
        console.log(friendsArray);
    }

    onMount(async () => {
        // build the map - pretty sure all config has to happen in here
        map = new google.maps.Map(container, {
            zoom,
            center,
            //   styles: mapStyles, // optional
        });

        new google.maps.Marker({
            position: wan,
            map,
            title: "Wan",
        });

        // marker.setMap(map);
        // This event listener calls addMarker() when the map is clicked.

        google.maps.event.addListener(map, "click", (event) => {
            console.log(event.latLng.lat());
            addMarker(event.latLng, map);
        });
    });
</script>

<div class="full-screen" bind:this={container} />

<style>
    .full-screen {
        width: 100vw;
        height: 100vh;
    }
</style>

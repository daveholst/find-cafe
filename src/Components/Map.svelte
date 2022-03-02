<script>
    //   import mapStyles from "./map-styles"; // optional
    import { onMount } from "svelte";
    import CafeList from "./CafeList.svelte";
    import { SearchResultsStore } from "../Stores/SearchResults";

    let container;
    let map;
    let zoom = 13;
    let center = { lat: -31.9523, lng: 115.8613 };
    let wan = { lat: -31.9118, lng: 115.8126 };

    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let labelIndex = 0;

    let friendsArray = [];

    let centerPoint;
    let searchRadius = 500; //is this m? ft miles?
    let service;

    let friendsPolygon = new google.maps.Polygon({
        paths: friendsArray,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
    });

    let searchCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        center: wan,
        radius: 500,
    });

    function getCenter(points) {
        let sumX = 0;
        let sumY = 0;
        for (let i = 0; i < points.length; i++) {
            console.log("pointss", points[i]);
            const { lat, lng } = points[i];
            sumX += lat;
            sumY += lng;
        }
        return { lat: sumX / points.length, lng: sumY / points.length };
    }

    function haversineDistance(mk1, mk2) {
        const R = 6371; // Radius of the Earth in km
        const rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
        const rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
        const difflat = rlat2 - rlat1; // Radian difference (latitudes)
        const difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

        const d =
            2 *
            R *
            Math.asin(
                Math.sqrt(
                    Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                        Math.cos(rlat1) *
                            Math.cos(rlat2) *
                            Math.sin(difflon / 2) *
                            Math.sin(difflon / 2)
                )
            );
        return d * 1000; // Radius in km
    }

    function getRadius(center, coordArray) {
        let maxDistance = 0;
        coordArray.forEach((point) => {
            let calculatedDistance = haversineDistance(center, point);
            if (calculatedDistance > maxDistance) {
                maxDistance = calculatedDistance;
            }
        });
        return maxDistance * 0.75; // magic number to keep circle smaller
    }

    function drawCircle(coordArray) {
        if (coordArray.length > 1) {
            // calc center
            const searchCenter = getCenter(coordArray);
            // change center
            searchCircle.setCenter(searchCenter);
            // calc Radius
            const searchRadius = getRadius(searchCenter, coordArray);
            console.log("SR::", searchRadius);
            // change radius
            searchCircle.setRadius(searchRadius);

            // apply to map
            searchCircle.setMap(map);
        }
    }

    function addMarker(location, map) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.
        new google.maps.Marker({
            position: location,
            label: labels[labelIndex++ % labels.length],
            map: map,
        });
        friendsArray.push({ lat: location.lat(), lng: location.lng() });

        console.log(friendsArray);
    }

    onMount(async () => {
        // build the map - pretty sure all config has to happen in here
        map = new google.maps.Map(container, {
            zoom,
            center,
            //   styles: mapStyles, // optional
        });
        // cerate place lookup
        service = new google.maps.places.PlacesService(map);

        new google.maps.Marker({
            position: wan,
            map,
            title: "Wan",
        });

        // marker.setMap(map);
        // This event listener calls addMarker() when the map is clicked.

        google.maps.event.addListener(map, "click", async (event) => {
            let cafeRequest = {
                location: {},
                // location: new google.maps.LatLng(centerPoint),
                radius: "500", //TODO do a proper calc here
                type: ["cafe"],
            };
            addMarker(event.latLng, map);
            const calculatedCenter = await getCenter(friendsArray);
            cafeRequest.location = calculatedCenter;
            drawCircle(friendsArray);

            service.nearbySearch(cafeRequest, function (results, status) {
                console.log(status);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results);
                    // add to store
                    SearchResultsStore.update(() => results);
                }
            });
        });
    });
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

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

    let centerPoint;
    let service;

    let friendsPolygon = new google.maps.Polygon({
        paths: friendsArray,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
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

    function drawPolygon(pointsArray) {
        if (pointsArray.length > 1) {
            // wipe existing polygon
            friendsPolygon.setMap(null);
            // build polygon
            friendsPolygon = new google.maps.Polygon({
                paths: friendsArray,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
            });
            // apply to map
            friendsPolygon.setMap(map);
            console.log("getCenter:: ", getCenter(friendsArray));
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
                radius: "500",
                type: ["restaurant"],
            };

            console.log(event.latLng.lat());
            addMarker(event.latLng, map);
            drawPolygon(friendsArray);
            console.log("cent:: ", getCenter(friendsArray));
            cafeRequest.location = await getCenter(friendsArray);
            console.log("centerP:: ", centerPoint);
            // dra  wCenter(getCenter(friendsArray));
            console.log("cafe req::", cafeRequest);
            service.nearbySearch(cafeRequest, function (results, status) {
                console.log(status);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results);
                    //  for (var i = 0; i < results.length; i++) {
                    // createMarker(results[i]);
                }
                //   map.setCenter(results[0].geometry.location);
                // }
            });

            // });
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

import { Coordinate, getCenter, getRadius } from "./geometry"

export function drawCircle(
    coordArray: Coordinate[],
    circle: google.maps.Circle,
    map: google.maps.Map
) {
    if (coordArray.length > 1) {
        // calc center
        const searchCenter = getCenter(coordArray)
        // change center
        circle.setCenter(searchCenter)
        // calc Radius
        const searchRadius = getRadius(searchCenter, coordArray) * 0.75 // magic number to keep circle smaller
        // change radius
        circle.setRadius(searchRadius)
        // apply to map
        circle.setMap(map)
    }
}

export function addMarker(
    location: google.maps.LatLng,
    map: google.maps.Map
): Coordinate {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    new google.maps.Marker({
        position: location,
        // label: labels[labelIndex++ % labels.length],
        map: map,
        icon: pinSymbol(),
    })
    return { lat: location.lat(), lng: location.lng() }
}

export function pinSymbol(color: string = "blue") {
    return {
        path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#000",
        strokeWeight: 2,
        scale: 1,
    }
}

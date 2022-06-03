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

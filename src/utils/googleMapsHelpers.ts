import type { FriendsArrayItem } from "../Stores/FriendsArray"
import type { SearchResult } from "../Stores/SearchResults"
import { Coordinate, getCenter, getRadius } from "./geometry"

export function drawCircle(
    friendsArray: FriendsArrayItem[],
    circle: google.maps.Circle,
    map: google.maps.Map
) {
    const coordArray = friendsArray.map((f) => f.location)
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
): FriendsArrayItem {
    // Add the marker at the clicked location
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinSymbol(),
    })
    return { location: { lat: location.lat(), lng: location.lng() }, marker }
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

export function matchResult(location: Coordinate, resultList: SearchResult[]) {
    const { lat, lng } = location
    return resultList.find(
        (r) =>
            r.googleData.geometry.location.lat() === lat &&
            r.googleData.geometry.location.lng() === lng
    )
}

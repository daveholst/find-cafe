import { Writable, writable } from "svelte/store"
// import type { CustomResultsMarker } from "../utils/CutomResultsMarker"

export interface SearchResults {
    /** Search result from placesRequest (search) */
    result: google.maps.places.PlaceResult
    /** Attached marker objet  */
    marker?: google.maps.Marker
    metadata?: {
        /** Average distance to all friends in Km  */
        averageDistance: string
    }
}

export const SearchResultsStore = writable<SearchResults[]>([])

// when results goto the store, add marker a drop pins
// SearchResultsStore.subscribe((results) => {
//     results.map((result) => {
//         const resultLocation = result.geometry.location
//         const marker = new google.maps.Marker({
//             position: resultLocation,
//             animation: google.maps.Animation.DROP,
//             label: "",
//             map: map,
//         })
//         marker.setLabel(
//             averageDistance({
//                 from: marker,
//                 to: friendsArray,
//             }).toFixed(1)
//         )
//         // setMarkerColor(marker, friendsArray)
//         SearchMarkersStore.update((current) => [...current, marker])
//     })
// })

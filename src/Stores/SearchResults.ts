import { Writable, writable } from "svelte/store"
// import type { CustomResultsMarker } from "../utils/CutomResultsMarker"

export interface SearchResults {
    /** Search result from placesRequest (search) */
    googleData: google.maps.places.PlaceResult
    /** Attached marker objet  */
    marker?: google.maps.Marker
    metadata?: {
        /** Average distance to all friends in Km  */
        avgDistance?: string
    }
}

export const SearchResultsStore = writable<SearchResults[]>([])

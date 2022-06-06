import { SearchResult, SearchResultsStore } from "../Stores/SearchResults"
import {
    averageDistance,
    Coordinate,
    getCenter,
    getRadius,
    pinSymbol,
} from "../utils"
import { randomColor } from "../utils/randomColor"
import { SelectedCafeStore } from "../Stores/SelectedCafe"
import type { FriendsArrayItem } from "../Stores/FriendsArray"

interface searchDrawOptions {
    /** Array of friends to search between */
    friendsArray: FriendsArrayItem[]
    /** Google Places search service */
    searchService: google.maps.places.PlacesService
    /** Target map for drawing markers */
    map: google.maps.Map
}

export function searchDraw({
    friendsArray,
    searchService,
    map,
}: searchDrawOptions) {
    const coordArray = friendsArray.map((f) => f.location)
    const searchCenterPoint = getCenter(coordArray)
    const cafeRequest: google.maps.places.PlaceSearchRequest = {
        location: searchCenterPoint,
        radius: getRadius(searchCenterPoint, coordArray) || 500, // meters
        type: "cafe",
    }

    if (coordArray.length <= 1) {
        return
    }
    // Search for cafes
    searchService.nearbySearch(cafeRequest, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            throw new Error(`Search failed with ${status} `)
        }
        // add results to store
        SearchResultsStore.update(() =>
            results.map((cafe) => {
                const cafeLocation = cafe.geometry.location
                const rndColor = randomColor({ opacity: 40 })
                const marker = new google.maps.Marker({
                    icon: pinSymbol(rndColor.solid),
                    position: cafeLocation,
                    animation: google.maps.Animation.DROP,
                    map: map,
                })
                const avgDistance =
                    averageDistance({
                        from: marker,
                        to: coordArray,
                    }).toFixed(1) || undefined
                // TODO how can this event by typed?
                google.maps.event.addListener(marker, "click", (e) => {
                    SelectedCafeStore.set({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                    })
                })
                return {
                    googleData: cafe,
                    marker,
                    metadata: {
                        avgDistance,
                        color: rndColor,
                    },
                }
            })
        )
    })
}

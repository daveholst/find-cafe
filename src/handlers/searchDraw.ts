import { SearchResultsStore } from "../Stores/SearchResults"
import {
    averageDistance,
    Coordinate,
    getCenter,
    getRadius,
    pinSymbol,
} from "../utils"

interface searchDrawOptions {
    /** Array of friends to search between */
    friendsArray: Coordinate[]
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
    const searchCenterPoint = getCenter(friendsArray)
    const cafeRequest: google.maps.places.PlaceSearchRequest = {
        location: searchCenterPoint,
        radius: getRadius(searchCenterPoint, friendsArray) || 500, // meters
        type: "cafe",
    }
    if (friendsArray.length <= 1) {
        return
    }
    // Search for cafes
    searchService.nearbySearch(cafeRequest, (results, status) => {
        console.log(status)
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log(results)
            // add to store
            SearchResultsStore.update(() =>
                results.map((cafe) => {
                    const cafeLocation = cafe.geometry.location
                    const marker = new google.maps.Marker({
                        // optimized: false, // stops the marker from flashing
                        // draggable: true, // stops the marker from flashing
                        icon: pinSymbol("pink"),
                        position: cafeLocation,
                        animation: google.maps.Animation.DROP,
                        map: map,
                    })
                    const avgDistance =
                        averageDistance({
                            from: marker,
                            to: friendsArray,
                        }).toFixed(1) || undefined
                    return {
                        googleData: cafe,
                        marker,
                        metadata: {
                            avgDistance,
                        },
                    }
                })
            )
        }
    })
}

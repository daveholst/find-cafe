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
                            to: friendsArray,
                        }).toFixed(1) || undefined
                    // add the event listener for click events

                    // TODO how can this event by typed?
                    google.maps.event.addListener(marker, "click", (e) => {
                        console.log(e)
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
        }
    })
}

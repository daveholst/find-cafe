import { Coordinate, haversineDistance } from "./geometry"

/** Takes an array of coordinates and returns the average distance from all points */
interface AverageDistance {
    /** Google Marker datum point */
    from: google.maps.Marker
    /** Measuring Points - ie. an array of friends locations */
    to: Coordinate[]
}

export function averageDistance({ from, to }: AverageDistance): number {
    const fromMarker: Coordinate = {
        lat: from.getPosition().lat(),
        lng: from.getPosition().lng(),
    }
    // build distances array to each to point
    const distances = to.map((toLocation) =>
        haversineDistance(fromMarker, toLocation)
    )
    // calculate average
    const averageDistance =
        distances.reduce((a, b) => a + b, 0) / distances.length
    // average distance in kilometers
    return averageDistance / 1000
}

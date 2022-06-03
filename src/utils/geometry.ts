export interface Coordinate {
    lat: number
    lng: number
}

export function getCenter(points: Coordinate[]): Coordinate {
    let sumX = 0
    let sumY = 0
    for (let i = 0; i < points.length; i++) {
        console.log("pointss", points[i])
        const { lat, lng } = points[i]
        sumX += lat
        sumY += lng
    }
    return { lat: sumX / points.length, lng: sumY / points.length }
}

export function haversineDistance(p2: Coordinate, pt2: Coordinate): number {
    const R = 6371 // Radius of the Earth in km
    const rlat1 = p2.lat * (Math.PI / 180) // Convert degrees to radians
    const rlat2 = pt2.lat * (Math.PI / 180) // Convert degrees to radians
    const difflat = rlat2 - rlat1 // Radian difference (latitudes)
    const difflon = (pt2.lng - p2.lng) * (Math.PI / 180) // Radian difference (longitudes)

    const d =
        2 *
        R *
        Math.asin(
            Math.sqrt(
                Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                    Math.cos(rlat1) *
                        Math.cos(rlat2) *
                        Math.sin(difflon / 2) *
                        Math.sin(difflon / 2)
            )
        )
    return d * 1000 // Radius in km
}

export function getRadius(
    center: Coordinate,
    coordArray: Coordinate[]
): number {
    let maxDistance = 0
    coordArray.forEach((point) => {
        let calculatedDistance = haversineDistance(center, point)
        if (calculatedDistance > maxDistance) {
            maxDistance = calculatedDistance
        }
    })
    return maxDistance
}

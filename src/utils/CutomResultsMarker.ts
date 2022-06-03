// import { Coordinate, haversineDistance } from "./geometry"

// export class CustomResultsMarker extends google.maps.Marker {
//     public averageDistance: number
//     setAverageDistance(friendsArray: Coordinate[]) {
//         let distances = []

//         const markerLocation: Coordinate = {
//             lat: this.getPosition().lat(),
//             lng: this.getPosition().lng(),
//         }
//         // build distance to each friend
//         friendsArray.forEach((friendLocation) => {
//             distances.push(haversineDistance(markerLocation, friendLocation))
//         })

//         this.averageDistance =
//             distances.reduce((a, b) => a + b, 0) / distances.length
//     }
//     getAverageDistance() {
//         return this.averageDistance
//     }
// }

export {}

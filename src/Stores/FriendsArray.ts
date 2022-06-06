import { writable } from "svelte/store"
import type { Coordinate } from "../utils"

export interface FriendsArrayItem {
    location: Coordinate
    marker: google.maps.Marker
}
export const FriendsArrayStore = writable<FriendsArrayItem[]>([])

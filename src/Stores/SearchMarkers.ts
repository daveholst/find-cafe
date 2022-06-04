import { Writable, writable } from "svelte/store"

export const SearchMarkersStore: Writable<google.maps.Marker[]> = writable([])

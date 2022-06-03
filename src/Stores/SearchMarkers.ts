import { Writable, writable } from "svelte/store"
import type { CustomResultsMarker } from "../utils/CutomResultsMarker"

export const SearchMarkersStore: Writable<CustomResultsMarker[]> = writable([])

import { writable } from "svelte/store"
import type { Coordinate } from "../utils"
import type { SearchResult } from "./SearchResults"

export const SelectedCafeStore = writable<Coordinate>()

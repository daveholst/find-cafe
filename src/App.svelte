<script lang="ts">
    import Map from "./Components/Map.svelte";
    export let ready;
    import { googleMapsApiKey } from "../config.local";

    let googleScriptSrc = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=places,geometry`;
</script>

<svelte:head>
    <script defer async src={googleScriptSrc}>
    </script>
</svelte:head>

{#if ready}
    <Map />
{/if}

<style>
    :global(body) {
        padding: 0;
    }
</style>

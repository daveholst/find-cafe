<script>
    import Map from "./Components/Map.svelte";
    export let ready;
</script>

<svelte:head>
    <script
        defer
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCx8340Vz_qk5DTsW_0qV5TLctf-xl7DKI&callback=initMap&libraries=places">
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

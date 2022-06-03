import App from "./App.svelte"

const app = new App({
    target: document.body,
    props: {
        ready: false,
    },
})

// Added this to get initMap to pass TS error
declare const window: Window &
    typeof globalThis & {
        initMap: any
    }

window.initMap = function ready() {
    app.$set({ ready: true })
}

export default app

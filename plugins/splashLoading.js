export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('page:finish', () => {
        const loadingElement = document.querySelector('#loading')
        console.log('working', loadingElement);
        if (loadingElement) {
            loadingElement.remove()
        }
    })
})
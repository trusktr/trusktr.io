/**
 * Await for this to run code after the DOM's sub-resources have been loaded
 * (images, scripts, etc).
 *
 * @example
 * ```js
 * async function main() {
 *     await windowLoaded()
 *     console.log('Window loaded!')
 * }
 * main()
 * ```
 */
export default
async function windowLoaded() {
    if (document.readyState !== 'complete') {
        await new Promise(function(resolve) {
            window.addEventListener('load', resolve)
        })
    }
}

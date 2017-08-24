/**
 * Await for this to run code after the DOM has been parsed and loaded (but not
 * sub-resources like images, scripts, etc).
 *
 * @example
 * ```js
 * async function main() {
 *     await documentReady()
 *     console.log('Document ready!')
 * }
 * main()
 * ```
 */
export default
async function documentReady() {
    if (document.readyState === 'loading') {
        await new Promise(function(resolve) {
            document.addEventListener('DOMContentLoaded', resolve)
        })
    }
}

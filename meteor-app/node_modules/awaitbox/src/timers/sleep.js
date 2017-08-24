/**
 * Await for a certain amount of time.
 *
 * @example
 * ```js
 * async function main() {
 *     await sleep(10000)
 *     console.log('Logged after 10000 milliseconds!')
 * }
 * main()
 * ```
 */
export default
function sleep(duration) {
    let resolve = null
    const promise = new Promise(r => resolve = r)
    setTimeout(resolve, duration)
    return promise
}

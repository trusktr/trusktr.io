/**
 * Await this to run code after Meteor is ready (client and server).
 *
 * @example
 * ```js
 * import meteorStartup from 'awaitbox/meteor/startup'
 * async function main() {
 *     await meteorStartup()
 *     console.log('Meteor ready!')
 * }
 * main()
 * ```
 */
export default
function startup() {
    return new Promise(r => Meteor.startup(r))
}

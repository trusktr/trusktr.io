/**
 * Await for this to run code after the DOM has been parsed and loaded (but not
 * sub-resources like images, scripts, etc).
 *
 * The _passThrough arg is not for public use, it's for making data pass
 * through in promise chains.
 */
module.exports = function documentReady( _passThrough ) {

    if ( document.readyState === 'loading' ) {
        return new Promise( resolve => {
            document.addEventListener( 'DOMContentLoaded', () => resolve( _passThrough ) )
        } )
    }

    return Promise.resolve( _passThrough )

}

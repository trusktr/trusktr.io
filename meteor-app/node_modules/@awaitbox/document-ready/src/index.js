/**
 * Await for this to run code after the DOM has been parsed and loaded (but not
 * sub-resources like images, scripts, etc).
 *
 * The _passThrough arg is not for public use, it's for making data pass
 * through in promise chains.
 */
export default
async function documentReady( _passThrough ) {

    if ( document.readyState === 'loading' ) {
        await new Promise( resolve => {
            document.addEventListener( 'DOMContentLoaded', resolve )
        } )
    }

    return _passThrough

}

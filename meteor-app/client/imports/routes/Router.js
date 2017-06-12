
export default
class Router {
    constructor() {
        this.routes = new Map
        this.lastLocation = ''
        this._dependencies = null
        this._popStateListener = null
    }

    start(dependencies) {
        if (dependencies != undefined) this._dependencies = dependencies
        this._addWindowPopstateListener()

        const {pathname, search, hash} = document.location
        const currentLocation = pathname + search + hash
        this.go(currentLocation, true)
    }

    stop() {
        this._removeWindowPopStateListener()
    }

    with(routeExpression, actions) {
        this.routes.set(routeExpression, actions)
    }

    /**
     * @param {string} url Change the part after the domain name to anything (a
     * path with or without the search and hash).
     */
    go(url, _isStart) {
        window.history.pushState('', '', url)
        this._triggerActions()
    }

    _addWindowPopstateListener() {
        this._popStateListener = event => this._triggerActions()
        window.addEventListener('popstate', this._popStateListener)
    }

    _removeWindowPopStateListener() {
        window.removeEventListener('popstate', this._popStateListener)
        this._popStateListener = null
    }

    _triggerActions(isStart = false) {
        const {pathname, search, hash} = document.location
        const currentLocation = pathname + search + hash

        // trigger actions only if the route URL actually changed. If it didn't
        // change, but the router is being started, trigger actions anyways.
        if (!isStart && this.lastLocation == currentLocation) return

        const leaveActions = []
        const enterActions = []

        // get matching action sets for both lastLocation and currentLocation
        for (const [routeExpression, actions] of this.routes) {
            if (this.lastLocation.match(routeExpression) && actions.leave) {
                leaveActions.push(actions.leave)
            }
            if (currentLocation.match(routeExpression) && actions.enter) {
                enterActions.push(actions.enter)
            }
        }

        // trigger leave handlers for lastLocation
        for (const leaveAction of leaveActions) {
            leaveAction(this._dependencies)
        }

        // trigger enter handlers for currentLocation
        for (const enterAction of enterActions) {
            enterAction(this._dependencies)
        }

        this.lastLocation = currentLocation
    }
}

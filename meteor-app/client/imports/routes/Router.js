
export default
class Router {
    constructor() {
        this.routes = new Map
        this.lastLocation = ''

        this.addWindowPopstateListener()
    }

    addWindowPopstateListener() {
        window.addEventListener('popstate', event => {
            this._triggerActions()
        })
    }

    _triggerActions() {
        let {pathname, search, hash} = document.location
        let currentLocation = pathname + search + hash

        // trigger actions only if the route URL actually changed.
        if (this.lastLocation == currentLocation) return

        let leaveActions = []
        let enterActions = []

        // get matching action sets for both lastLocation and currentLocation
        for (let [routeExpression, actions] of this.routes) {
            if (this.lastLocation.match(routeExpression) && actions.leave) {
                leaveActions.push(actions.leave)
            }
            if (currentLocation.match(routeExpression) && actions.enter) {
                enterActions.push(actions.enter)
            }
        }

        // trigger leave handlers for lastLocation
        for (let leaveAction of leaveActions) {
            leaveAction()
        }

        // trigger enter handlers for currentLocation
        for (let enterAction of enterActions) {
            enterAction()
        }

        this.lastLocation = currentLocation
    }

    with(routeExpression, actions) {
        this.routes.set(routeExpression, actions)
    }

    /**
     * @param {string} url Change the part after the domain name to anything (a
     * path with or without the search and hash).
     */
    go(url) {
        window.history.pushState('', '', url)
        this._triggerActions(url)
    }
}

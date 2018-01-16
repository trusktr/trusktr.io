// Import needed components
import Home from '../../ui/pages/home.vue';
import NotFound from '../../ui/pages/not-found/not-found.js';

// Import the router factory
import { RouterFactory, nativeScrollBehavior } from 'meteor/akryum:vue-router2'

// Create router instance
export const routerFactory = new RouterFactory({
  mode: 'history',
  scrollBehavior: nativeScrollBehavior,
})

RouterFactory.configure(router => {

    router.addRoutes([
        {
            path: '/',
            component: Home,
        }
    ])

})

RouterFactory.configure(router => {

    router.addRoute({
        path: '*',
        component: NotFound,
    })

}, -1)

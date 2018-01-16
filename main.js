import meteorStartup from '@awaitbox/meteor-startup'

// entry point
~async function main() {

    if (Meteor.isClient) {

        const [
            {default: Vue},
            {routerFactory},
            {default: MainLayout},
        ] = await Promise.all([
            import('vue'),
            import('/imports/startup/client/routes'),
            import('/imports/ui/layouts/main-layout.vue'),
            import('/imports/startup/client/setup-vue'),
            meteorStartup(),
        ])

        // bootstrap the Vue app
        new Vue({
            el: '#ui-root',
            router: routerFactory.create(),
            ...MainLayout
        })

        console.log('client side started')

    }
    else if (Meteor.isServer) {

        const [{createFixtures}] = await Promise.all([
            import('/imports/startup/server/fixtures'),
            import('/imports/startup/server/register-api'),
            meteorStartup(),
        ])

        createFixtures()

        console.log('server side started')

    }

}()

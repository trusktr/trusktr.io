<template>
    <div class="main-layout">

        <div class="layoutItem">
            <h1> Chat Widget </h1>
        </div>

        <div class="layoutItem">
            <!--
                When we switch routes, the given route's view is rendered here
                (swapped with the previous route's view). See
                /imports/client/routes.js to see what view each route renders.
            -->
            <router-view></router-view>
        </div>

    </div>
</template>

<style scoped lang="stylus">
    .main-layout {

        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        .layoutItem {
            max-height: 100%;
        }

        h1 { margin: 0; padding: 0 10px; }

    }
</style>

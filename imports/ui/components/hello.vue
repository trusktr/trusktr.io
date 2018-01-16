<template>
    <div>
        <button @click="buttonClicked">Click Me</button>
        <p>You've pressed the button {{counter}} times.</p>
        <router-link to="/asdfasdf">non-existent page (404)</router-link>
    </div>
</template>

<script>
    export default {
        data: () => ({
            counter: 0,
        }),

        methods: {
            buttonClicked() {
                this.counter++
            },
        },
    }
</script>

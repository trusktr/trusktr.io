<template>
    <div>
    <button @click="buttonClicked">Click Me</button>
    <p>You've pressed the button {{counter}} times.</p>
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
        mounted() {},
    }
</script>

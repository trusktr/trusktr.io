<template>
    <div>
        <hello></hello>
        <info></info>
    </div>
</template>

<script>
    import Hello from '../components/hello.vue';
    import Info from '../components/info.vue';

    export default {
        components: {
            Hello,
            Info,
        },
    }
</script>

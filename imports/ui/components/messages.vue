<template>
    <div class="root">

        <div class="scroll">

            <ul v-if="$subReady['messages.all']">
                <li v-for="msg in messages"><a :href="msg.url" target="_blank">{{msg.value}}</a></li>
            </ul>
            <span v-else> Loading... </span>

        </div>

        <form class="info-link-add" @submit.prevent="addMessage()">
            <input type="text" ref="messageInput" placeholder="..." required>
            <input type="submit" value="Send message">
        </form>

    </div>
</template>

<style scoped>
    .root {
        width: 100%;
        height: 100%;
        border: 1px solid teal;
    }

    .scroll {
        padding-top: 20px;
        transform: translateY(-20px);

        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>

<script>
    import { Messages } from '/imports/api/messages/messages.js'
    import { Meteor } from 'meteor/meteor'

    export default {
        data: () => ({
            messages: [],
        }),

        methods: {
            addMessage() {
                const inputField = this.$refs.messageInput

                Meteor.call('messages.insert', inputField.value, (error) => {
                    if (error) alert(error.error);
                    else {
                        // clear the input field
                        inputField.value = '';
                    }
                });
            },
        },

        meteor: {
            $subscribe: {
                'messages.all': [],
            },
            messages() {
                return Messages.find({})
            },
        },
    }
</script>

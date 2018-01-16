<template>
    <div>
    <h2>Learn Meteor!</h2>
    <ul>
        <template v-if="$subReady.links">
            <li>
                <form class="info-link-add" @submit.prevent="addLink($event)">
                    <input type="text" name="title" placeholder="Title" required>
                    <input type="url" name="url" placeholder="Url" required>
                    <input type="submit" name="submit" value="Add new link">
                </form>
            </li>
            <li v-for="link in links"><a :href="url" target="_blank">{{link.title}}</a></li>
        </template>
        <template v-else>
            <li> Loading... </li>
        </template>
    </ul>
    </div>
</template>

<script>
    import { Links } from '/imports/api/links/links.js';
    import { Meteor } from 'meteor/meteor';

    export default {
        data: () => ({
            links: [],
        })
        mounted() {},
        methods: {
            addLink(event) {
                const target = event.target;
                const title = target.title;
                const url = target.url;

                Meteor.call('links.insert', title.value, url.value, (error) => {
                    if (error) {
                        alert(error.error);
                    } else {
                        title.value = '';
                        url.value = '';
                    }
                });
            },
        },
        meteor: {
            $subscribe: {
                'links.all': [],
            },
            links() {
                return Links.find({})
            },
        },
    }
</script>

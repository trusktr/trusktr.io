<template>
	<div ref="root">
		<button @click="updateTime">Update Time</button>
		<p>The time is now: {{ currentTime }}</p>
		<ul>
			<li v-for="t in TimeCursor" :key="t._id">
				{{ t.time }} - {{ t._id }}
			</li>
		</ul>
	</div>
</template>

<style scoped>
	div {
		color: white;
	}
</style>

<script>
	import { Time } from "/imports/Time";

	export default {
		methods: {
			updateTime() {
				console.log("Calling Meteor Method UpdateTime");
				Meteor.call("UpdateTime"); // not Meteor reactive
			}
		},
		meteor: {
			// Subscriptions - Errors not reported spelling and capitalization.
			$subscribe: {
				Time: []
			},
			// A helper function to get the current time
			currentTime() {
				console.log("Calculating currentTime");
				var t = Time.findOne("currentTime") || {};
				return t.time;
			},
			// A Minimongo cursor on the Time collection is added to the Vue instance
			TimeCursor() {
				// Here you can use Meteor reactive sources like cursors or reactive vars
				// as you would in a Blaze template helper
				return Time.find(
					{},
					{
						sort: { time: -1 }
					}
				);
			}
		}
	};
</script>

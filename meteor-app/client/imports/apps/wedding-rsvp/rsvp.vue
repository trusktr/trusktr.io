<template>
	<div ref="root" class="root">
		<img
			class="headerImg"
			:src="headerImgUrl"
		/>

		<h1 class="name"><span>Joe & Anastasiia</span></h1>
		<p class="action">~ Celebrate their love and union on ~</p>
		<p class="date">09 . 28 . 19</p>

		<div class="squareGrid">
			<div v-for="i in gridImages" :key="i">
				<img :src="i" />
			</div>
		</div>

		<p class="question">
			~ Do you want to stop by and say:
			<span class="emphasis">“HI?”</span>
			~
		</p>

		<div class="answers">
			<a @click="rsvp('no')">
				<span class="rsvpKeyword">Sorry,</span>
				I am gonna have fun doing other things, but I will be thinking
				about you.
			</a>
			<a @click="rsvp('yes')">
				<span class="rsvpKeyword">Heck yeah!</span>
				I am gonna come and tell funny stories about you to your guests!
			</a>

			<!-- <a @click="rsvp('undecided')">Not sure</a> -->
		</div>

		<p class="assurance">
			~ We will be your friends regardless of your answer! ~
		</p>

		<!-- <p>Current response: {{ currentRsvp }}</p>

		<ul>
			<li v-for="t in rsvps" :key="t._id">{{ t.rsvp }} - {{ t._id }}</li>
		</ul> -->
	</div>
</template>

<style scoped lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Lato:100|Playfair+Display:400i,900&display=swap');

	.root {
		background: white;
		width: 100%;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
		text-align: center;
	}

	img {
		object-fit: cover;
	}

	p {
		font-family: 'Playfair Display', serif;
		font-size: 3vw;
		font-style: italic;
	}

	.headerImg {
		width: 100%;
		height: calc( 100vh - 14vw );
		object-position: 50% 0%;
	}

	.name {
		font-family: 'Playfair Display', serif;
		font-size: 5vw;
		font-weight: 900;
		text-transform: uppercase;

		span {
			background: tan;
			padding: 1vw 3vw 1.7vw;
			border-radius: 3vw;
		}
	}

	.action {
	}

	.date {
		font-size: 8vw;
		font-family: 'Lato', sans-serif;
		font-size: 100;
		font-style: unset;
	}

	.squareGrid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		& > * {
			display: block;
			position: relative;
		}

		& > *::before {
			content: "";
			display: block;
			padding-top: 100%;
		}

		& > * > * {
			display: block;
			position: absolute;
			left: 0; top: 0;
			width: 100%;
			height: 100%;
		}
	}

	.question {
		.emphasis {
			font-weight: 600;
			font-size: 1.3em;
		}
	}

	.answers {
		width: 100%;
		display: flex;
		justify-content: center;
		margin: 60px 0px;
	}

	.answers > a {
		background: #b1aaa5;
		padding: 20px;
		cursor: pointer;
		user-select: none;
		width: 30%;

		.answers > a:first-child {
			margin-right: 2em;
		}

		.rsvpKeyword {
			background: white;
			padding: 3px;
		}
	}

	.assurance {
	}
</style>

<script>
	import { WeddingRSVPs } from "/imports/WeddingRSVPs";

	const id = location.search && location.search.split("?")[1];
	if (!id) throw "URL does not have ID!";

	export default {
		data: () => ({
			headerImgUrl: '/apps/wedding-rsvp/photos/header.jpg',
			gridImages: [
				'/apps/wedding-rsvp/photos/1.jpg',
				'/apps/wedding-rsvp/photos/2.jpg',
				'/apps/wedding-rsvp/photos/3.jpg',
				'/apps/wedding-rsvp/photos/4.jpg',
				'/apps/wedding-rsvp/photos/5.jpg',
				'/apps/wedding-rsvp/photos/6.jpg',
			],
		}),
		async created() {
			this.style = null;
		},
		mounted() {
			this.style = document.createElement("style");
            this.style.textContent = `
                body, html { background: white }
                #menuNode { display: none !important; }
            `;
			document.head.appendChild(this.style);
		},
		destroyed() {
			document.head.removeChild(this.style);
		},
		methods: {
			rsvp(yesOrNo) {
				Meteor.call("rsvpToWedding", yesOrNo, id);
			}
		},
		meteor: {
			$subscribe: {
				WeddingRSVPs: []
			},

			currentRsvp() {
				const t = WeddingRSVPs.findOne(id) || {};
				return t.rsvp;
			},

			rsvps() {
				return WeddingRSVPs.find({});
			}
		}
	};
</script>
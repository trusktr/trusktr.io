<template>
	<div ref="root" class="root">
		<img
			ref="headerImg"
			class="headerImg"
			:src="headerImgUrl"
		/>

		<h1 class="name"><span>Joe & Anastasiia</span></h1>
		<p class="action">~ celebrate their love and union on ~</p>
		<p class="date">09 . 28 . 19</p>

		<div class="squareGrid imageGrid" ref="imageGrid">
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
			<a @click="rsvp('no')" :class="{active: currentRsvp === 'no'}">
				<div>
					<span class="rsvpKeyword">Sorry,</span><br />
					I am gonna have fun doing other things, but I will be thinking
					about you.
				</div>
			</a>
			<a @click="rsvp('yes')" :class="{active: currentRsvp === 'yes'}">
				<div>
					<span class="rsvpKeyword">Heck yeah!</span><br />
					I am gonna come and tell funny stories about you to your guests!
				</div>
			</a>

			<!-- <a @click="rsvp('undecided')">Not sure</a> -->
		</div>

		<div v-if="currentRsvp === 'yes'" class="howMany">

			<p class="assurance">
				~ Yaay! 🥳 ~<br />~ How many people will you bring? ~
			</p>

			<div class="howManyInput">
				<a class="increment" @click="increment"></a>
				<div class="count">
					<span>{{howMany}}</span>
				</div>
				<a class="decrement" @click="decrement"></a>
			</div>

		</div>

		<p class="assurance" v-if="currentRsvp === 'no'">
			~ See you soon anyways! 😊 ~
		</p>

		<p class="assurance" v-if="currentRsvp === 'undecided'">
			~ We will be your friends regardless of your answer! ~
		</p>

		<img class="flower" :src="flowerUrl" />

		<img class="footerImg" :src="footerImgUrl" />

		<!-- <p>Current response: {{ currentRsvp }}</p>

		<ul>
			<li v-for="t in rsvps" :key="t._id">{{ t.rsvp }} - {{ t._id }}</li>
		</ul> -->

	</div>
</template>

<style scoped lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Lato:100,700|Playfair+Display:400i,900&display=swap');

	.root {
		position: relative;
		background: white;
		width: 100%;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
		text-align: center;
		font-family: 'Playfair Display', serif;
		transform-style: preserve-3d;

		--rsvp-bottom-space: 6vw;
		--rsvp-font-size: 16px;

		font-size: calc( var(--rsvp-font-size) + 1vw );
	}

	img {
		object-fit: cover;
	}

	p {
		font-style: italic;
		margin-top: calc( var(--rsvp-font-size) + 5vw );
		margin-bottom: calc( var(--rsvp-font-size) + 5vw );
	}

	.headerImg {
		width: 100%;
		height: calc( 100vh - var(--rsvp-bottom-space) );

		// starts at this value, and is animated on scroll with JavaScript
		object-position: 50% 0%;
	}

	@media (max-width: 600px) {
		.name {
			transform: translate(-50%, 50%) !important;
		}
	}

	.name {
		font-family: 'Playfair Display', serif;
		font-size: calc( var(--rsvp-font-size) + 5vw );
		font-weight: 900;
		text-transform: uppercase;
		color: white;

		position: absolute;
		bottom: var(--rsvp-bottom-space);
		margin: 0;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;

		span {
			padding: calc( var(--rsvp-font-size) + 1vw ) calc( var(--rsvp-font-size) + 3vw ) calc( var(--rsvp-font-size) + 1.7vw );
		}
	}

	.action {
		margin-top: 1.8em;
	}

	.date {
		font-size: calc( var(--rsvp-font-size) + 7vw );
		font-family: 'Lato', sans-serif;
		font-style: unset;
		margin-top: 0;
	}

	.squareGrid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		> * {
			display: block;
			position: relative;
			overflow: hidden;
		}

		> *::before {
			content: "";
			display: block;
			padding-top: 100%;
		}

		> * > * {
			display: block;
			position: absolute;
			left: 0; top: 0;
			width: 100%;
			height: 100%;
		}
	}

	.imageGrid {
		img {
			transform-origin: 50% 50%;

			will-change: transform;
			// initial value, gets animated by JS
			transform: translate3d(0, 0, 0.0001px) scale( 1.3 );
		}
	}

	.question {
		.emphasis {
			font-weight: 600;
			font-size: calc( var(--rsvp-font-size) + 1.3vw );
		}
	}

	.answers {
		width: 100%;
		transform: translateY(calc( -1 * ( var(--rsvp-font-size) + 1vw ) ));
		display: flex;
		justify-content: center;
		margin: 60px 0px;
		font-family: 'Lato', sans-serif;
		font-weight: bold;
		text-transform: uppercase;
		font-size: calc( var(--rsvp-font-size) + 0.5vw );
		color: white;

		> a {
			background: #b1aaa5;
			padding: 20px;
			cursor: pointer;
			user-select: none;
			width: 30%;
			transition: box-shadow 0.4s;
		}

		> a:hover {
			box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.4);
		}

		> a.active {
			background: #94b44f;
		}

		> a:first-child {
			margin-right: 2em;
		}

		.rsvpKeyword {
			background: white;
			color: #333;
			padding: 0.02em 0.2em;
			font-size: calc( var(--rsvp-font-size) + 0.5vw );
		}
	}

	.assurance {
		margin-top: calc( var(--rsvp-font-size) + 7vw );
		margin-bottom: calc( var(--rsvp-font-size) + 1vw );
	}

	.howMany {
		margin-top: calc( var(--rsvp-font-size) + 5vw );
		margin-bottom: calc( var(--rsvp-font-size) + 5vw );
	}

	.howManyInput {
		user-select: none;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;

		.count {
			width: calc( 100px + 10vw );
			height: calc( 100px + 5vw );
			text-align: center;
			background: #94b44f;
			color: white;
			font-family: monospace;
			font-size: calc( 64px + 6vw );
			position: relative;
			margin: calc( var(--rsvp-font-size) + 1vw ) 0;
			font-family: 'Playfair Display', serif;

			span {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -59%);
			}
		}

		.increment, .decrement {
			border-bottom: 1em solid rgba(0, 0, 0, 0.1);
			border-left: 1em solid transparent;
			border-right: 1em solid transparent;
		}

		.decrement {
			transform-origin: 50% 50%;
			transform: rotateZ(180deg);
		}
	}

	.flower {
		margin-top: calc( var(--rsvp-font-size) + 1vw );
		width: calc( 150px + 20vw );
	}

	.footerImg {
		width: 100%;
		margin-top: calc( var(--rsvp-font-size) + 1vw );
		display: block;
	}
</style>

<script>
	import { WeddingRSVPs } from "/imports/WeddingRSVPs";
	import {ScrollObserver} from '../utils/ScrollObserver'

	const id = location.search && location.search.split("?")[1];
	if (!id) throw "URL does not have ID!";

	export default {
		data: () => ({
			headerImgUrl: '/apps/wedding-rsvp/photos/header.jpg',
			footerImgUrl: '/apps/wedding-rsvp/photos/proposed.jpg',
			flowerUrl: '/apps/wedding-rsvp/photos/flower.svg',
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

			this.headerScrollObserver = null
			this.headerScrollHandler = null

			this.imageGridScrollObserver = null
			this.imageGridScrollHandler = null
		},

		mounted() {
			this.style = document.createElement("style");
            this.style.textContent = `
                body, html { background: white }
                #menuNode { display: none !important; }
			`;

			document.head.appendChild(this.style);

			const viewportHeight = this.$refs.root.clientHeight

			this.headerScrollObserver = new ScrollObserver({
				begin: 0,
				end: viewportHeight,
				container: this.$refs.root,
				useAnimationFrame: true,
			})

			const headerImg = this.$refs.headerImg

			this.headerScrollHandler = progress => {
				headerImg.style.setProperty('object-position', `50% ${progress * 100}%`)
			}

			this.headerScrollObserver.on('scroll', this.headerScrollHandler)

			const imageGrid = this.$refs.imageGrid
			const imageGridScrollBegin = imageGrid.offsetTop - viewportHeight
			const mobileAdjustment = window.innerWidth / window.innerHeight < 1 ? this.$refs.root.clientWidth * 0.3 : 0
			const imageGridScrollEnd = imageGrid.offsetTop - mobileAdjustment

			this.imageGridScrollObserver = new ScrollObserver({
				begin: imageGridScrollBegin,
				end: imageGridScrollEnd,
				container: this.$refs.root,
				useAnimationFrame: true,
			})

			const images = Array.from(imageGrid.querySelectorAll('img'))

			this.imageGridScrollHandler = progress => {
				let image

				for (let i=0, l=images.length; i<l; i+=1) {
					image = images[i]
					image.style.setProperty('transform', `translate3d(0, 0, 0.0001px) scale(${1.3 - 0.29 * progress})`)
				}
			}

			this.imageGridScrollObserver.on('scroll', this.imageGridScrollHandler)

			// let d = document.createElement('div')
			// d.style.border = '2px solid red'
			// d.style.position = 'absolute'
			// d.style.width = '100%'
			// d.style.top = `${imageGridScrollBegin}px`
			// d.style.left = '0'
			// this.$refs.root.appendChild(d)

			// d = document.createElement('div')
			// d.style.border = '2px solid cyan'
			// d.style.position = 'absolute'
			// d.style.width = '100%'
			// d.style.top = `${imageGridScrollEnd}px`
			// d.style.left = '0'
			// this.$refs.root.appendChild(d)
		},

		destroyed() {
			document.head.removeChild(this.style);
			this.headerScrollObserver.off('scroll', this.headerScrollHandler)
		},

		methods: {
			/**
			 * @param {'yes' | 'no' | 'undecided'} yesOrNo
			 */
			rsvp(yesOrNo) {
				Meteor.call("rsvpToWedding", yesOrNo, id);
			},

			increment() {
				Meteor.call("incrementHowMany", id);
			},

			decrement() {
				Meteor.call("decrementHowMany", id);
			},
		},

		meteor: {
			$subscribe: {
				WeddingRSVPs: []
			},

			currentRsvp() {
				const t = WeddingRSVPs.findOne(id) || {};
				return t.rsvp;
			},

			howMany() {
				const t = WeddingRSVPs.findOne(id) || {};
				return t.howMany || 0;
			},

			rsvps() {
				return WeddingRSVPs.find({});
			}
		}
	};
</script>
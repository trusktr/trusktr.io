<template>
	<div ref="root" class="root">
		<img
			ref="headerImg"
			class="headerImg"
			:src="headerImgUrl"
		/>

		<h1 class="name"><span>Joe & Anastasiia</span></h1>
		<p class="action">~ Celebrate their love and union on ~</p>
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
			<a @click="rsvp('no')">
				<div>
					<span class="rsvpKeyword">Sorry,</span>
					I am gonna have fun doing other things, but I will be thinking
					about you.
				</div>
			</a>
			<a @click="rsvp('yes')">
				<div>
					<span class="rsvpKeyword">Heck yeah!</span>
					I am gonna come and tell funny stories about you to your guests!
				</div>
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
		font-size: 2.3vw;
		transform-style: preserve-3d;

		--rsvp-bottom-space: 6vw;
	}

	img {
		object-fit: cover;
	}

	p {
		font-style: italic;
	}

	.headerImg {
		width: 100%;
		height: calc( 100vh - var(--rsvp-bottom-space) );

		// starts at this value, and is animated on scroll with JavaScript
		object-position: 50% 0%;
	}

	.name {
		font-family: 'Playfair Display', serif;
		font-size: 5vw;
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
			padding: 1vw 3vw 1.7vw;
		}
	}

	.action {
		margin-top: 1.4em;
	}

	.date {
		font-size: 7vw;
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

			// initial value, gets animated by JS
			transform: translate3d(0, 0, 0.0001px) scale( 1.3 );
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
		font-family: 'Lato', sans-serif;
		font-weight: bold;
		text-transform: uppercase;
		font-size: 2.5vw;
		color: white;

		> a {
			background: #b1aaa5;
			padding: 20px;
			cursor: pointer;
			user-select: none;
			width: 30%;
		}

		> a:first-child {
			margin-right: 2em;
		}

		.rsvpKeyword {
			background: white;
			color: black;
			padding: 0.2vw;
			font-size: 3vw;
		}
	}

	.assurance {
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
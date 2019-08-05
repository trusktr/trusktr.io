/* global reset */
export default {
	'html, body': {
		padding: 0,
		margin: 0,
		height: '100%',
		width: '100%',
		position: 'relative',
		backgroundColor: 'rbga(0,0,0,0)',
	},
	html: {
		'& body': {
			font: '14px "Lucida Grande", Helvetica, Arial, sans-serif',
			//transform: translateZ(1px), [>antialiasing in firefox<]
			overflow: 'hidden',

			'& *': {
				//remove OS focus outlines
				//antialiasing in firefox?
				outline: '1px solid transparent',

				boxSizing: 'border-box',
				//'pointerEvents': 'none',
			},

			'& input': {
				border: 'none',
			},

			'& a': {
				//color: inherit,
			},

			'& iframe': {
				border: 'none',
			},
		},
	},
}


/* global reset */
export default {
    'html, body': {
        padding: 0,
        margin: 0,
        height: '100%',
        width: '100%',
        position: 'relative',
        backgroundColor: 'white',
    },
    html: {
        '& body': {
            font: '14px "Lucida Grande", Helvetica, Arial, sans-serif',
            //transform: translateZ(1px), [>antialiasing in firefox<]
            overflow: 'hidden',

            '& *': {
                //antialiasing in firefox? 
                //remove OS focus outlines
                'outline': '1px solid transparent',
            },

            '& input': {
                'border': 'none',
            },

            '& a': {
                //color: inherit,
            },

            '& iframe': {
                'border': 'none',
            }
        }
    }
}

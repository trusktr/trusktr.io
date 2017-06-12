export const menuColor = 'rgb(45,45,45)'

export default {
    html: {
        '& body': {
            background: '#222',

            '& .hidden': {
                display: 'none',
            },

            '& .invisible': {
                visibility: 'visible',
            },

            '& #menu': {
                'box-sizing': 'border-box',
                position: 'absolute',
                width: '100%',
                height: '100%',
                padding: '20px',
                margin: 0,
                'list-style': 'none',
                background: menuColor,
                display: 'block',
                'font-size': '1.3rem',

                '& li': {
                    'padding-bottom': '10px',
                    display: 'inline',
                    //'text-shadow': '0px 4px 2px #000',
                },
                '& a': {
                    'text-decoration': 'none',
                    color: '#1DD326', // green
                    'border-radius': '2px',
                    padding: '0 3px',
                },
                '& a:hover': {
                    'text-decoration': 'none',
                    color: menuColor,
                    background: '#1DD326',
                },
                '& .sub.menuitem': {
                    'font-size': '0.8rem',
                },
            },

            '& #contentNode': {
                '& iframe': {
                    width: '100%',
                    height: '100%',
                }
            }
        }
    }
}

var menuColor = 'rgb(45,45,45)'

export default {
    '@global': {
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
                        color: '#1DD326',
                        'border-radius': '2px',
                        padding: '0 3px',
                    },
                    '& a:hover': {
                        'text-decoration': 'none',
                        color: 'rgb(45,45,45)',
                        background: '#1DD326',
                    },
                    '& .sub.menuitem': {
                        'font-size': '0.8rem',
                    },
                    '&:after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        'margin-top': '-10px',
                        left: '100%',

                        //triangle
                        //TODO: Move this into PushMenuLayout, and make optional.
                        width: 0,
                        height: 0,
                        'border-top': '10px solid transparent',
                        'border-left': '10px solid '+menuColor,
                        'border-bottom': '10px solid transparent',
                    }
                }
            }
        }
    },
}

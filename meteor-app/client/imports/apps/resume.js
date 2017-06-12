import * as React from 'react'
export default () => (
    <iframe
        src={(
            document.location.hostname == 'localhost' ?
            document.location.origin :
            `//docs.google.com/viewer?embedded=true&url=${document.location.origin}`
        ) + `/resume.pdf`}>
    </iframe>
)

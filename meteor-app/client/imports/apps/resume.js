import * as React from 'react'
export default
class extends React.Component {
    render() {
        return <iframe
            src={(
                document.location.hostname == 'localhost' ?
                document.location.origin :
                `//docs.google.com/viewer?embedded=true&url=${document.location.origin}`
            ) + `/resume.pdf`}>
        </iframe>
    }
}

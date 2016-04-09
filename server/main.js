
// TODO: doesn't work. See https://github.com/meteorhacks/meteor-inject-initial/issues/18
Inject.rawModHtml('raf-timeout', function(html, res) {
    console.log(' ------ HTML', html)
    return  html + "<!-- hello Inject -->"
})

function sleep(duration) {
    return new Promise(r => setTimeout(r, duration))
}

async function main() {
    await sleep(1000)
    console.log('logged after 1 sec')
}

main()

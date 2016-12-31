
// TODO: doesn't work. See https://github.com/meteorhacks/meteor-inject-initial/issues/18
//Inject.rawModHtml('raf-timeout', function(html, res) {
    //console.log(' ------ ARGS', arguments)
    //res.end(html + "<!-- hello Inject -->")
    //return html
//})

import fs from 'fs'
import path from 'path'

import {Picker} from 'meteor/meteorhacks:picker'
//import {BuildTools} from 'meteor/rocket:build-tools'
import {MeteorFilesHelpers} from 'meteor/sanjo:meteor-files-helpers'
const {getAppPath} = MeteorFilesHelpers

import routes from './routes'

for (const route of routes) {
    Picker.route(`/${route}`, function(params, req, res, next) {
        const appDir = getAppPath()
        // TODO: switch to async version of readFile after figuring out
        // https://github.com/meteorhacks/picker/issues/46.
        const html = fs.readFileSync(path.resolve(appDir, 'public', 'pages', route, 'index.html'))
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)
    })
}

function sleep(duration) {
    return new Promise(r => setTimeout(r, duration))
}

async function main() {
    await sleep(1000)
    console.log('logged after 1 sec')
}

main()

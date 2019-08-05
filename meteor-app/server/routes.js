import fs from 'fs'
import path from 'path'
import {Picker} from 'meteor/meteorhacks:picker'
import {MeteorFilesHelpers} from 'meteor/sanjo:meteor-files-helpers'

const {getAppPath} = MeteorFilesHelpers

// These are serverside-only routes, they just render my static examples.
export const routes = [
    //'webglearth',
    'clobe',
    'mom2015',
    'flipDiagonal',
    'passwordReveal',
    //'calendar',
    'password',

    'hello',
    'portfolio',

    'giants',
    'greg5050',
    'johnnyCrook',
    'scrollViewTest',
    'jumpyGlitch',
]

export function setRoutes() {
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
}
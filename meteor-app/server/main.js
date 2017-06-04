
// TODO: doesn't work. See https://github.com/meteorhacks/meteor-inject-initial/issues/18
//Inject.rawModHtml('raf-timeout', function(html, res) {
    //console.log(' ------ ARGS', arguments)
    //res.end(html + "<!-- hello Inject -->")
    //return html
//})

import fs from 'fs'
import path from 'path'
import {Meteor} from 'meteor/meteor'
import {Picker} from 'meteor/meteorhacks:picker'
//import {BuildTools} from 'meteor/rocket:build-tools'
import {MeteorFilesHelpers} from 'meteor/sanjo:meteor-files-helpers'
import routes from './routes'
import {HTTP} from 'meteor/http'

const {getAppPath} = MeteorFilesHelpers

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

function createPromise() {
    let resolve, reject
    const promise = new Promise((res, rej) => { resolve = res; reject = rej})
    return {promise, resolve, reject}
}

const http = {
    get: function(url, options) {
        const {resolve, reject, promise} = createPromise()

        HTTP.call('get', url, options, (err, result) => {
            if (err) throw err
            resolve(result)
        })

        return promise
    },
}

// sometimes espruino (or the MPU6050 module) sends back invalid
// JSON, numbers with trailing periods, which JSON.parse doesn't
// like, so we fix it if that happens
function parseEspruinoJson(string) {
    let result = ''

    try {
        result = JSON.parse(string)
    }
    catch(e) {
        while(string.includes('.,'))
            string = string.replace('.,', ',')

        while(string.includes('.]'))
            string = string.replace('.]', ']')

        result = JSON.parse(string)
    }

    return result
}

async function main() {
    let previousResult

    Meteor.methods({
        getMpuData: async function() {
            await sleep(1000)
            let error = null

            console.log('sending HTTP request to Espruino.')

            let startTime = Date.now()
            const newResult = await http.get('http://192.168.0.8')
                .catch(e => error = e)
            let endTime = Date.now()

            console.log('Got HTTP response from Espruino.', endTime - startTime)

            // if there was a network error, just use the previous result.
            if (!error) previousResult = newResult

            return parseEspruinoJson(previousResult.content)
        },
        foo: function(...args) {
            console.log(' --- foo method:', ...args)
            return {bar: 'baz', n:2}
        }
    })
    await sleep(1000)
    console.log('logged after 1 sec')
}

Meteor.startup(main)

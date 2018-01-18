
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
//import {HTTP} from 'meteor/http'
//import {parseEspruinoJson} from '/both/imports/espruino'

const {getAppPath} = MeteorFilesHelpers

function setRoutes() {
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

function sleep(duration) {
    return new Promise(r => setTimeout(r, duration))
}

//function createPromise() {
    //let resolve, reject
    //const promise = new Promise((res, rej) => { resolve = res; reject = rej})
    //return {promise, resolve, reject}
//}

//const http = {
    //get(url, options) {
        //const {resolve, reject, promise} = createPromise()

        //HTTP.call('get', url, options, (err, result) => {
            //if (err) throw err
            //resolve(result)
        //})

        //return promise
    //},
//}

let previousResult

//Meteor.methods({

    //async getMpuData() {
        //await sleep(1000)
        //let error = null

        //console.log('sending HTTP request to Espruino.')

        //let startTime = Date.now()
        //const newResult = await http.get('http://192.168.43.247')
            //.catch(e => error = e)
        //let endTime = Date.now()

        //console.log('Got HTTP response from Espruino.', endTime - startTime)

        //// if there was a network error, just use the previous result.
        //if (!error) previousResult = newResult

        //return parseEspruinoJson(previousResult.content)
    //},

    //foo(...args) {
        //console.log(' --- foo method:', ...args)
        //return {bar: 'baz', n:2}
    //},

//})

//import MeteorClient from './imports/MeteorClient'

//async function websocketDDPTest() {
    //const client = new MeteorClient

    //try {
        //const sessionId = await client.connect(
            //// find the IP in Chrome OS network settings, click on the network
            //// in the list and then "connection" tab.
            ////'192.168.0.5:3000'
            //'localhost:3000'
        //)

        //console.log('session ID:', sessionId)

        //const result = await client.call('foo', 1, 2, 3)

        //console.log(' --------------------- Method result!:', result)

    //}
    //catch(e) {
        //throw e
    //}
//}

//function createBroadcastServer() {
    ////let broadcast1 = new Meteor.Broadcast('orientation1')
    ////let broadcast2 = new Meteor.Broadcast('orientation2')
    ////let broadcast3 = new Meteor.Broadcast('orientation3')

    //let streamer = new Meteor.Streamer('orientation')
    //streamer.allowRead('all');
    //streamer.allowWrite('all');
//}

function setupCORS() {
    Picker.route(`(.*)`, function(params, req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })
}

async function main() {
    //websocketDDPTest()
    //createBroadcastServer() // For devices to broadcast accelerometer data
    setRoutes()
    setupCORS()
    await sleep(1000)
    console.log('logged after 1 sec')
}

main()

import WebSocket from 'ws'

export default
class MeteorClient {

    constructor() {
        this.ws = undefined
        this.methodId = 1
    }

    connect(host) {
        var resolve, reject
        const promise = new Promise((res, rej) => {resolve = res; reject = rej})

        // Node.js/browser version.
        this.ws = new WebSocket(`ws://${host}/websocket`)

        // Espruino version?
        //this.ws = new WebSocket(host,{
            //path: '/websocket',
            //port: 3000,
        //});

        this.ws.addEventListener('open', () => {
            this.ws.send(JSON.stringify({
                msg: 'connect',
                version: '1',
                support: [ '1', 'pre2', 'pre1' ]
            }))
        })

        const onconnect = msg => {
            msg = JSON.parse(msg.data)

            console.log('onconnect msg?', msg)

            if (msg.msg && msg.msg == 'failed') reject(new Error('connection failed.'))
            if (msg.msg && msg.msg == 'error') reject(new Error(msg.reason))

            if (msg.msg && msg.msg == 'connected') {
                this.ws.removeEventListener('message', onconnect)
                resolve(msg.session)
            }
        }

        const onping = msg => {
            msg = JSON.parse(msg.data)

            if (msg.msg && msg.msg == 'ping') {
                this.ws.send(JSON.stringify({
                    msg: 'pong'
                }))

                setTimeout(() => this.ws.send(JSON.stringify({
                    msg: 'ping'
                })), 25000)
            }
        }

        this.ws.addEventListener('message', onconnect)
        this.ws.addEventListener('message', onping)

        return promise
    }

    call(methodName, ...args) {
        var resolve, reject
        const promise = new Promise((res, rej) => {resolve = res; reject = rej})

        const currentMethodId = (this.methodId++).toString()

        const onmethod = msg => {
            msg = JSON.parse(msg.data)

            if (msg.msg && msg.msg == 'failed') reject(new Error('Method call failed.'))
            if (msg.msg && msg.msg == 'error') reject(new Error(msg.reason))

            if (msg.msg && msg.msg == 'result' && msg.id == currentMethodId) {
                console.log(' --- method result:', msg.result)
                this.ws.removeEventListener('message', onmethod)
                resolve(msg.result)
            }
        }

        this.ws.addEventListener('message', onmethod)

        this.ws.send(JSON.stringify({
            msg: 'method',
            method: methodName,
            params: [...args],
            id: currentMethodId,
        }))

        return promise
    }
}

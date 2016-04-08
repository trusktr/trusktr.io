class TickCounter {
    constructor() { this.current = -1 }

    async start() {
        this.shouldCount = true
        while (this.shouldCount) { this.current += 1; await null }
    }

    stop() { this.shouldCount = false }
}

const sleep = time => new Promise(r => setTimeout(r, time))

async function main() {
    let counter = new TickCounter
    counter.start()
    console.log('current tick:', counter.current) // is 0

    await sleep(0)

    // these lines never fire.
    console.log('current tick:', counter.current) // was expecting 1
    counter.stop()
}

main()

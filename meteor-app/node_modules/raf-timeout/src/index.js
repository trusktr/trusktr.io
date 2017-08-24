~function() {
    const oldSetTimeout = window.setTimeout
    window.setTimeout = function(fn, timeout) {
        oldSetTimeout.call(window, () => requestAnimationFrame(fn), timeout)
    }

    const oldSetInterval = window.setInterval
    window.setInterval = function(fn, interval) {
        oldSetInterval.call(window, () => requestAnimationFrame(fn), interval)
    }
}()

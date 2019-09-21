import Observable from 'infamous/core/Observable'

export class ScrollObserver extends Observable {
    constructor({ begin, end, container, useAnimationFrame }) {
        super()

        this.begin = begin
        this.end = end
        this.container = container || window
        this.useAnimationFrame = useAnimationFrame

        this.handlers = 0
        this.animationFrame = null
    }

    on(...args) {
        super.on(...args)

        if (!this.handlers++) {
            this.container.addEventListener('scroll', this.onScroll)
        }
    }

    off(...args) {
        super.off(...args)

        if (! --this.handlers) {
            this.container.removeEventListener('scroll', this.onScroll)

            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame)
                this.animationFrame = null
            }
        }
    }

    onScroll = (event) => {
        const { begin, end } = this
        const scrollAmount = this.container === window ? pageYOffset : this.container.scrollTop
        const scrollHeight = this.container === window ? document.body.scrollHeight : this.container.scrollHeight
        const totalScrollableAmount = scrollHeight - viewportHeight
        const viewportHeight = this.container === window ? window.innerHeight : this.container.clientHeight

        // this math is based on https://github.com/vaneenige/uos/blob/780dc482899421393dadfc5f89209ded896c0210/src/index.ts#L10-L12
        const ratio =
            end <= 1
                ? (scrollAmount / totalScrollableAmount - begin) / (end - begin)
                : (scrollAmount - begin) / (end - begin);

        if (this.useAnimationFrame && !this.animationFrame) {
            this.animationFrame = requestAnimationFrame(() => {
                this.trigger('scroll', ratio < 0 ? 0 : ratio > 1 ? 1 : ratio)
                this.animationFrame = null
            })
        }
        else this.trigger('scroll', ratio < 0 ? 0 : ratio > 1 ? 1 : ratio)
    }
}
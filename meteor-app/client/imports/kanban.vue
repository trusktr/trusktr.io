<template>
    <div class="boards">
        <div class="board" v-for="(board, boardIndex) in boards">
            <div class="board-name" :style="{ background: board.color }">
                {{ board.name }}
            </div>

            <div v-for="(card, cardIndex) in board.cards" class="card">
                <div class="move-left" v-if="boardIndex > 0" @click="moveLeft(boardIndex, cardIndex)"> &lt; </div>
                <div class="text"> {{ card.text }} </div>
                <div class="move-right" v-if="boardIndex < 3" @click="moveRight(boardIndex, cardIndex)"> &gt; </div>
            </div>

            <div class="add-card-btn" @click="addCard(boardIndex)">
                + Add a card
            </div>
        </div>
    </div>
</template>

<style scoped>
    .root {
        font-family: sans-serif
    }

    .boards {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }

    .board {
        flex-grow: 1;
        margin-left: 25px;
        background: #eee;
    }

    .board:nth-child(4) {
        margin-right: 25px;
    }

    .board-name {
        text-align: center;
    }

    .card {
        display: flex;
        justify-content: space-between;
    }

    .move-left, .move-right {
        width: 20px;
        flex-grow: 1;
        max-width: 20px;
    }

    .text {
        flex-grow: 2;
    }

    .move-left, .move-right, .text {
        text-align: center;
    }

</style>

<script>
    export default {
        data: () => ({
            helloTxt: 'Hello Triplebyte.',
            boards: [
                { color: '#8e6e95', name: 'one', cards:   [{ text: 'blah' }, { text: 'woo hoo' }] },
                { color: '#39a59c', name: 'two', cards:   [{ text: 'bar' }, { text: 'wow!' }] },
                { color: '#344759', name: 'three', cards: [{ text: 'lorem' }, { text: 'awesome' }] },
                { color: '#e8741e', name: 'four', cards:  [{ text: 'hello' }, { text: 'cool' }] },
            ],
        }),

        computed: {
            clicksTimes5() {
                return this.clicks * 5
            }
        },

        methods: {
            incrementClick() {
                this.clicks += 1
            },
            addCard(index) {
                const boards = this.boards[index]
                const text = window.prompt('New card text: ', 'New card.')
                boards.cards.push({
                    text
                })
                this.boards = boards.slice()
            },
            moveLeft(boardIndex, cardIndex) {
                const board = this.boards[boardIndex]
                const leftBoard = this.boards[boardIndex - 1]
                const card = board.cards[cardIndex]
                board.cards.splice(cardIndex, 1)
                leftBoard.cards.push(card)
                this.boards = this.boards.slice()
            },
            moveRight(boardIndex, cardIndex) {
                const board = this.boards[boardIndex]
                const rightBoard = this.boards[boardIndex + 1]
                const card = board.cards[cardIndex]
                board.cards.splice(cardIndex, 1)
                rightBoard.cards.push(card)
                this.boards = this.boards.slice()
            },
        },
    }
</script>

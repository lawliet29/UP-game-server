import * as io from 'socket.io-client'

const playerSocket = io('/player')

playerSocket.on('player-connected', data => {
    console.log(data)
})

import * as io from 'socket.io-client'

const adminSocket = io('/admin')

adminSocket.on('update', data => {
    console.log(data)
})

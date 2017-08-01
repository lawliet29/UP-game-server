import * as express from 'express'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as path from 'path'
import * as SocketIO from 'socket.io'
import * as http from 'http'
import {SingletonAdminStateService} from './src/server/AdminStateService'

const playerPort = 9090
const adminPort = 9091
const apiPort = 9092

const playerConfig = {
    entry: {main: [
        './src/client/player/index.ts',
        `webpack-dev-server/client?http://localhost:${playerPort}`,
        'webpack/hot/only-dev-server'
    ]},
    output: {
        path: path.join(__dirname, '/dist/client/player'),
        filename: 'bundle.js',
        publicPath: `http://localhost:${playerPort}/dist/`
    }
}

const adminConfig = {
    entry: {main: [
        './src/client/admin/index.ts',
        `webpack-dev-server/client?http://localhost:${adminPort}`,
        'webpack/hot/only-dev-server'
    ]},
    output: {
        path: path.join(__dirname, 'dist/client/admin'),
        filename: 'bundle.js',
        publicPath: `http://localhost:${adminPort}/dist/`
    }
}

const commonConfig = {
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: 'ts-loader'}
        ]
    }
}

const commonDevServerConfig = {
    hot: true,
    historyApiFallback: true,
    stats: {colors: true},
    proxy: {
        '/socket.io': {
            target: `http://localhost:${apiPort}`,
            secure: false
        }
    }
}

const playerWebpackServer = new WebpackDevServer(webpack({...playerConfig, ...commonConfig}), {
    publicPath: playerConfig.output.publicPath,
    contentBase: './dist/client/player',
    ...commonDevServerConfig
})

const adminWebpackServer = new WebpackDevServer(webpack({...adminConfig, ...commonConfig}), {
    publicPath: adminConfig.output.publicPath,
    contentBase: './dist/client/admin',
    ...commonDevServerConfig
})

playerWebpackServer.listen(playerPort, () => {
    console.log(`Player server listening on port ${playerPort}`)
})

adminWebpackServer.listen(adminPort, () => {
    console.log(`Admin server listening on port ${adminPort}`)
})

const apiServer = http.createServer()
const io = SocketIO(apiServer)

apiServer.listen(apiPort)

const playerSocket = io.of('/player')
const adminSocket = io.of('/admin')

playerSocket.on('connection', socket => {
    console.log(`New connection: ${socket.client.id}`)

    socket.emit('player-connected', {clientId: socket.client.id})
})

adminSocket.on('connection', socket => {
    const emitUpdate = newState => socket.emit('update', newState)

    SingletonAdminStateService.stateService.subscribe(emitUpdate, {
        text: `Подключился администратор: ${socket.handshake.address}, clientId: ${socket.client.id}`,
        timestamp: new Date(),
        icon: 'green spy'
    })
    
    socket.on('action', ({name, params}) => {
        SingletonAdminStateService[name](...params);
    })

    socket.on('disconnect', () => SingletonAdminStateService.stateService.unsubscribe(emitUpdate, {
        text: `Администратор ${socket.client.id} отключился`,
        timestamp: new Date(),
        icon: 'red spy'
    }))

    emitUpdate(SingletonAdminStateService.stateService.state)
})

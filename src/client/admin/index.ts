import * as io from 'socket.io-client'
import * as React from 'react'
import {GameState} from '../../server/GameStateService'
import {Interface} from './Interface'
import * as ReactDOM from 'react-dom'

const adminSocket = io('/admin')

const action = (name, ...params) => adminSocket.emit('action', {name, params});

class StatefulWrapper extends React.Component<{}, GameState> {
    constructor(props) {
        super(props)

        adminSocket.on('update', data => {
            this.setState(data as GameState)
        })
    }

    render() {
        return React.createElement(Interface, {...this.state, socket: adminSocket, action})
    }
}

ReactDOM.render(React.createElement(StatefulWrapper), document.getElementById('interface'))

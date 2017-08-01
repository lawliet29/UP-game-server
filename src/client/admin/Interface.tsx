import * as React from 'react'
import {GameState} from '../../server/GameStateService'

export class Interface extends React.Component<GameState & {[propName: string]: any}> {
    render() {
        return (
            <div className="ui grid container">
                <div className="row">
                    <div className="fourteen wide column">
                        <div className="ui blue inverted menu">
                            <div className="active item">
                                Admin
                            </div>
                            <div className="right menu">
                                <a className="right aligned item">
                                    {this.props.socket.connected && <i className="large inverted green circle icon"></i>}
                                    {!this.props.socket.connected && <i className="large inverted red warning icon"></i>}
                                </a>
                                <a className="right aligned item"><i className="large setting icon"></i></a>
                                <a className="right aligned item"><i className="large sign out icon"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="eight wide column">
                        <div className="blue ui segment">

                        </div>
                    </div>
                    <div className="six wide column">
                        <div className="red ui segment">
                            <h3 className="ui header">
                                <i className="log icon"></i>
                                <div className="content">
                                    Журнал событий
                                </div>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

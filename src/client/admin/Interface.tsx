import * as React from 'react'
import {GameState} from '../../server/GameStateService'
import {keys, map, take} from 'lodash'

export class Interface extends React.Component<Partial<GameState> & {
    action: (actionName: string, ...args: any[]) => void,
    [propName: string]: any
}> {
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
                            <h3 className="small ui grey header">
                                <i className="list icon"></i>
                                <div className="content">
                                    Команды
                                </div>
                            </h3>
                            <div className="ui grid">
                                <div className="row">
                                    <div className="column">
                                        <div className="ui left labeled fluid button">
                                            <span className="basic ui label">{keys(this.props.teams || {}).length}</span>
                                            <button className="ui basic green fluid button" onClick={() => this.props.action('addTeam')}>
                                                <i className="ui plus icon"></i>
                                                Добавить команду
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="ui cards column">
                                        {map(this.props.teams || {}, (team, id) => (
                                            <div className="card" key={id}>
                                                <div className="content">
                                                    <div className="header">
                                                        {team.name}
                                                    </div>
                                                    <div className="meta">
                                                        Пароль: {id}
                                                    </div>
                                                    <div className="description">
                                                        Подключенные клиенты:
                                                        <ul>
                                                            {team.connectedClientIds.map(clientId => <li>{clientId}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="extra content">
                                                    <div className="ui basic tiny red button">
                                                        Удалить
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="six wide column">
                        <div className={`red ${this.props.log ? '' : 'loading'} ui segment`}>
                            <h3 className="small ui grey header">
                                <i className="feed icon"></i>
                                <div className="content">
                                    Журнал событий
                                </div>
                            </h3>
                            <div className="ui tiny relaxed middle aligned divided selection list">
                                {take(this.props.log || [], 15).map(entry => (
                                    <div className="item" key={String(entry.timestamp)}>
                                        <i className={`${entry.icon || 'blue info'} icon`}></i>
                                        <div className="content">
                                            <div className="header">
                                                {entry.text}
                                            </div>
                                            <div className="description">
                                                {new Date(entry.timestamp).toTimeString().split(' ')[0]}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

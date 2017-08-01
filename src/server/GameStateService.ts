export interface RoundInfo {
    [questionNumber: number]: {
        answer: string,
        isCorrect?: boolean
    }
}

export interface LogEntry {
    text: string,
    timestamp: Date,
    icon?: string
}

export interface TeamInfo {
    connectedClientIds: string[],
    name?: string,
}

export interface GameState {
    log: LogEntry[],
    currentRound: number | null,
    currentQuestion: number | null,
    teams: {[teamId: string]: TeamInfo}
}

export class GameStateService {
    state: GameState = {
        currentRound: null,
        currentQuestion: null,
        log: [],
        teams: {}
    }

    subscriptions: Array<(GameState) => void> = []
    
    setState(newState: Partial<GameState>) {
        this.state = {...this.state, ...newState}
    }

    log(logEntry: LogEntry) {
        this.setState({log: [logEntry, ...this.state.log]})
    }

    subscribe(callback: (newState: GameState) => void, logEntry: LogEntry) {
        this.subscriptions.push(callback)
        this.log(logEntry)
    } 

    unsubscribe(callback: (newState: GameState) => void, logEntry: LogEntry) {
        this.subscriptions = this.subscriptions.filter(s => s !== callback)
        this.log(logEntry)
    }
}

export const SingletonStateService = new GameStateService()

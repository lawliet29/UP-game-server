export interface RoundInfo {
    [questionNumber: number]: {
        answer: string,
        isCorrect?: boolean
    }
}

export interface TeamInfo {
    connectedClientIds: string[],
    name?: string,
}

export interface GameState {
    currentRound: number | null,
    currentQuestion: number | null,
    teams: {[teamId: string]: TeamInfo}
}

export class GameStateService {
    state: GameState = {
        currentRound: null,
        currentQuestion: null,
        teams: {}
    }

    subscriptions: Array<(GameState) => void> = []
    
    setState(newState: Partial<GameState>) {
        this.state = {...this.state, ...newState}
    }

    subscribe(callback: (newState: GameState) => void) {
        this.subscriptions.push(callback)
    } 

    unsubscribe(callback: (newState: GameState) => void) {
        this.subscriptions = this.subscriptions.filter(s => s !== callback)
    }
}

export const SingletonStateService = new GameStateService()

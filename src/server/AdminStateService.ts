import {GameStateService, SingletonStateService} from './GameStateService'

export class AdminStateService {
    stateService: GameStateService
    

    constructor(stateService: GameStateService) {
        this.stateService = stateService
    }


}

export const SingletonAdminStateService = new AdminStateService(SingletonStateService)


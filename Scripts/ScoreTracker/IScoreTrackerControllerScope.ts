namespace ScoreTracker {

    export interface IScoreTrackerControllerScope extends ng.IScope {

        currentGame: Game;
        newGame: Game;
        newPlayerName: string;
        gameList: Game[];
    
        saveCurrentPoints(): void;
        clearAllPoints(): void;
        getTotalPointsForPlayer(playerId: number): number;
        createNewPlayer(game: Game, playerName: string): void;
        saveNewGame(): void;
        createNewGame(): void;
        isGameLoaded(): boolean;
        addPlayer(): void;
        getNumberOfRounds(): number;
        manageGames(): void;
        loadGame(game: Game): void;
        deleteGame(game: Game): void;
        newGameIsInvalid(): boolean;
        invalidPlayerName(newPlayerName: string): boolean;
        removePlayer(player: Player, game: Game): void;

        getPlayerRoundScore(playerId: number, roundId: number): string;

    }
}
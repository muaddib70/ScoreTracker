namespace ScoreTracker {

    export class ScoreTrackerController {

        $inject = ['$scope', '$uibModal', 'storageService'];

        readonly storageKey = 'ScoreTracker';
        private gameLoaded: boolean = false;
        private currentOpenModal: ng.ui.bootstrap.IModalInstanceService;

        constructor(
            protected $scope: IScoreTrackerControllerScope,
            protected $uibModal: ng.ui.bootstrap.IModalService,
            protected storageService: Services.StorageService
        ) {

            this.$scope.gameList = this.loadGameList(this.storageService.getValueFromLocal(this.storageKey));

            $scope.saveCurrentPoints = this.saveCurrentPoints.bind(this);
            $scope.clearAllPoints = this.clearAllPoints.bind(this);
            $scope.getTotalPointsForPlayer = this.getTotalPointsForPlayer.bind(this);
            $scope.createNewPlayer = this.createNewPlayer.bind(this);
            $scope.saveNewGame = this.saveNewGame.bind(this);
            $scope.createNewGame = this.createNewGame.bind(this);
            $scope.isGameLoaded = this.isGameLoaded.bind(this);
            $scope.addPlayer = this.addPlayer.bind(this);
            $scope.getNumberOfRounds = this.getNumberOfRounds.bind(this);
            $scope.loadGame = this.loadGame.bind(this);
            $scope.manageGames = this.manageGames.bind(this);
            $scope.getPlayerRoundScore = this.getPlayerRoundScore.bind(this);
            $scope.deleteGame = this.deleteGame.bind(this);
            $scope.newGameIsInvalid = this.newGameIsInvalid.bind(this);
            $scope.invalidPlayerName = this.invalidPlayerName.bind(this);
            $scope.removePlayer = this.removePlayer.bind(this);
        }

        public removePlayer(player: Player, game: Game): void {
            game.Players.splice(game.Players.indexOf(player), 1);
        }

        public invalidPlayerName(newPlayerName: string): boolean {
            return (newPlayerName == null || newPlayerName.length < 1);
        }

        public newGameIsInvalid(): boolean {
            let isInvalid: boolean = true;

            if (this.$scope.newGame) {

                if (this.$scope.newGame.Name && this.$scope.newGame.Name.length > 0) {
                    let allPlayersValid: boolean = true;

                    this.$scope.newGame.Players.forEach((player: Player) => {
                        if (player.Name == null || player.Name.length < 1) {
                            allPlayersValid = false;
                        }
                    });

                    if (allPlayersValid) { isInvalid = false; }
                }
            }

            return isInvalid;
        }

        public deleteGame(game: Game): void {
            this.removeGameFromGameList(game);
            this.saveGameList();
        }

        public getPlayerRoundScore(playerId: number, roundId: number): string {
            let score: string = '-';

            let round = this.$scope.currentGame.Rounds.find(x => x.Id == roundId);
            if (round) {
                let pScore = round.PlayersPoints.find(x => x.PlayerId == playerId)
                if (pScore != null) {
                    score = pScore.PlayerScore.toString();
                }
            }
            return score;
        }

        public loadGame(game: Game): void {
            if (game) {
                this.$scope.currentGame = game;
                this.currentOpenModal.close(); 
                this.gameLoaded = true;
            }
        }

        public getNumberOfRounds(): number {
            return this.$scope.currentGame.getRoundsCount();
        }

        public saveCurrentPoints(): void {
            this.$scope.currentGame.AddRound();
            this.saveCurrentGame();
        }

        public clearAllPoints(): void {

            let confirmModal = this.$uibModal.open({
                templateUrl: 'confirmModal.html',
                controller: function ($scope: { confirmMessage: string; }) {
                    $scope.confirmMessage = 'This will erase all saved points and rounds are you sure?';
                }
            });

            confirmModal.result
                .then((x) => {
                    if (this.$scope.currentGame) {
                        this.$scope.currentGame.Rounds = [];
                        this.$scope.$applyAsync();
                    }
                })
                .catch((x) => {
                    console.log(x);
                })
        }

        public getTotalPointsForPlayer(playerId: number): number {
            return this.$scope.currentGame.getTotalPointsForPlayer(playerId);
        }

        public createNewPlayer(game: Game, playerName: string, closeModal: boolean): void {
            game.AddPlayer(playerName);

            if (closeModal) {
                this.currentOpenModal.close();
            }
        }

        public saveNewGame(): void {
            this.$scope.currentGame = this.$scope.newGame;
            this.gameLoaded = true;
            this.saveCurrentGame();
            this.currentOpenModal.close();
        }

        public createNewGame(): void {
            this.showCreateNewGameModal();
        }

        public isGameLoaded(): boolean {
            if (this.gameLoaded) {
                return true;
            }
            else {
                return false;
            }
        }

        public addPlayer(): void {
            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'addPlayerModal.html',
                scope: this.$scope
            });
        }

        public manageGames(): void {
            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'manageGameModal.html',
                scope: this.$scope
            });
        }

        private showCreateNewGameModal(): void {

            this.$scope.newGame = new Game(this.getNewGameId(), '');

            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'newGameModal.html',
                scope: this.$scope
            });
        }

        private saveCurrentGame(): void {
            if (this.$scope.gameList == null) { this.$scope.gameList = []; }

            let listGame = this.retrieveGameForGameList(this.$scope.currentGame);
            if (listGame == null) {
                this.$scope.gameList.push(this.$scope.currentGame);
            } else {
                let ind = this.$scope.gameList.indexOf(listGame);
                this.$scope.gameList[ind] = this.$scope.currentGame;
            }

            this.saveGameList();
        }

        private removeGameFromGameList(game: Game) {
            let listGame = this.retrieveGameForGameList(game);
            if (listGame != null) {
                this.$scope.gameList.splice(this.$scope.gameList.indexOf(listGame), 1);
            }
        }

        private retrieveGameForGameList(gameToRetrieve: Game): Game {
            if (this.$scope.gameList == null) {
                this.$scope.gameList = [];
                return null;
            }
            return this.$scope.gameList.find(x => x.Id == gameToRetrieve.Id);
        }

        private getNewGameId(): number {
            if (this.$scope.gameList == null) { return 0; }
            return this.$scope.gameList.reduce(((prev, current) => { return (prev.Id > current.Id) ? prev : current; }), { Id: 0 }).Id + 1;
        }

        private loadGameList(games: any[]): Game[] {
            let loadedGames: Game[] = [];
            if (games) {
                games.forEach((g) => {
                    let newG = new Game(g.Id, g.Name);
                    newG.Players = g.Players;
                    newG.Rounds = g.Rounds;
                    loadedGames.push(newG);
                });
            }

            return loadedGames;
        }

        private saveGameList() {
            this.storageService.saveValueToLocal(this.storageKey, this.$scope.gameList);
        }
    }
}
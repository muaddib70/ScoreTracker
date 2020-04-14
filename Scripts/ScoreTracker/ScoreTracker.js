var ScoreTracker;
(function (ScoreTracker) {
    class Game {
        constructor(id, name) {
            this.Id = id;
            this.Name = name;
            this.Players = [];
            this.Rounds = [];
        }
        ;
        AddPlayer(name) {
            this.CheckForPlayers();
            let newId = this.Players.reduce(((prev, current) => {
                return (prev.Id > current.Id) ? prev : current;
            }), { Id: 0 }).Id + 1;
            this.Players.push({ Id: newId, Name: name, CurrentScore: 0 });
        }
        getTotalPointsForPlayer(playerId) {
            let totalPoints = 0;
            this.CheckForPlayers();
            this.CheckForRounds();
            this.Rounds.forEach((round) => {
                let score = 0;
                round.PlayersPoints.forEach((playerPoints) => {
                    if (playerPoints.PlayerId == playerId)
                        score = playerPoints.PlayerScore;
                });
                totalPoints += score;
            });
            return totalPoints;
        }
        getRoundsCount() {
            this.CheckForRounds();
            return this.Rounds.length;
        }
        AddRound() {
            this.CheckForRounds();
            let round = new Round();
            round.Id = this.Rounds.reduce(((prev, current) => { return (prev.Id > current.Id) ? prev : current; }), { Id: 0 }).Id + 1;
            this.Players.forEach((player) => {
                round.PlayersPoints.push(new PlayerPoints(player.Id, player.CurrentScore));
                player.CurrentScore = 0;
            });
            this.Rounds.push(round);
        }
        CheckForPlayers() {
            if (this.Players == null) {
                this.Players = [];
            }
        }
        CheckForRounds() {
            if (this.Rounds == null) {
                this.Rounds = [];
            }
        }
    }
    ScoreTracker.Game = Game;
    class Round {
        constructor() { this.PlayersPoints = []; }
    }
    ScoreTracker.Round = Round;
    class PlayerPoints {
        constructor(id, score) { this.PlayerId = id; this.PlayerScore = score; }
    }
    ScoreTracker.PlayerPoints = PlayerPoints;
})(ScoreTracker || (ScoreTracker = {}));
var ScoreTracker;
(function (ScoreTracker) {
    class Player {
        constructor() { }
    }
    ScoreTracker.Player = Player;
})(ScoreTracker || (ScoreTracker = {}));
var ScoreTracker;
(function (ScoreTracker) {
    class ScoreTrackerController {
        constructor($scope, $uibModal, storageService) {
            this.$scope = $scope;
            this.$uibModal = $uibModal;
            this.storageService = storageService;
            this.$inject = ['$scope', '$uibModal', 'storageService'];
            this.storageKey = 'ScoreTracker';
            this.gameLoaded = false;
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
        removePlayer(player, game) {
            game.Players.splice(game.Players.indexOf(player), 1);
        }
        invalidPlayerName(newPlayerName) {
            return (newPlayerName == null || newPlayerName.length < 1);
        }
        newGameIsInvalid() {
            let isInvalid = true;
            if (this.$scope.newGame) {
                if (this.$scope.newGame.Name && this.$scope.newGame.Name.length > 0) {
                    let allPlayersValid = true;
                    this.$scope.newGame.Players.forEach((player) => {
                        if (player.Name == null || player.Name.length < 1) {
                            allPlayersValid = false;
                        }
                    });
                    if (allPlayersValid) {
                        isInvalid = false;
                    }
                }
            }
            return isInvalid;
        }
        deleteGame(game) {
            this.removeGameFromGameList(game);
            this.saveGameList();
        }
        getPlayerRoundScore(playerId, roundId) {
            let score = '-';
            let round = this.$scope.currentGame.Rounds.find(x => x.Id == roundId);
            if (round) {
                let pScore = round.PlayersPoints.find(x => x.PlayerId == playerId);
                if (pScore != null) {
                    score = pScore.PlayerScore.toString();
                }
            }
            return score;
        }
        loadGame(game) {
            if (game) {
                this.$scope.currentGame = game;
                this.currentOpenModal.close();
                this.gameLoaded = true;
            }
        }
        getNumberOfRounds() {
            return this.$scope.currentGame.getRoundsCount();
        }
        saveCurrentPoints() {
            this.$scope.currentGame.AddRound();
            this.saveCurrentGame();
        }
        clearAllPoints() {
            let confirmModal = this.$uibModal.open({
                templateUrl: 'confirmModal.html',
                controller: function ($scope) {
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
            });
        }
        getTotalPointsForPlayer(playerId) {
            return this.$scope.currentGame.getTotalPointsForPlayer(playerId);
        }
        createNewPlayer(game, playerName, closeModal) {
            game.AddPlayer(playerName);
            if (closeModal) {
                this.currentOpenModal.close();
            }
        }
        saveNewGame() {
            this.$scope.currentGame = this.$scope.newGame;
            this.gameLoaded = true;
            this.saveCurrentGame();
            this.currentOpenModal.close();
        }
        createNewGame() {
            this.showCreateNewGameModal();
        }
        isGameLoaded() {
            if (this.gameLoaded) {
                return true;
            }
            else {
                return false;
            }
        }
        addPlayer() {
            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'addPlayerModal.html',
                scope: this.$scope
            });
        }
        manageGames() {
            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'manageGameModal.html',
                scope: this.$scope
            });
        }
        showCreateNewGameModal() {
            this.$scope.newGame = new ScoreTracker.Game(this.getNewGameId(), '');
            this.currentOpenModal = this.$uibModal.open({
                templateUrl: 'newGameModal.html',
                scope: this.$scope
            });
        }
        saveCurrentGame() {
            if (this.$scope.gameList == null) {
                this.$scope.gameList = [];
            }
            let listGame = this.retrieveGameForGameList(this.$scope.currentGame);
            if (listGame == null) {
                this.$scope.gameList.push(this.$scope.currentGame);
            }
            else {
                let ind = this.$scope.gameList.indexOf(listGame);
                this.$scope.gameList[ind] = this.$scope.currentGame;
            }
            this.saveGameList();
        }
        removeGameFromGameList(game) {
            let listGame = this.retrieveGameForGameList(game);
            if (listGame != null) {
                this.$scope.gameList.splice(this.$scope.gameList.indexOf(listGame), 1);
            }
        }
        retrieveGameForGameList(gameToRetrieve) {
            if (this.$scope.gameList == null) {
                this.$scope.gameList = [];
                return null;
            }
            return this.$scope.gameList.find(x => x.Id == gameToRetrieve.Id);
        }
        getNewGameId() {
            if (this.$scope.gameList == null) {
                return 0;
            }
            return this.$scope.gameList.reduce(((prev, current) => { return (prev.Id > current.Id) ? prev : current; }), { Id: 0 }).Id + 1;
        }
        loadGameList(games) {
            let loadedGames = [];
            if (games) {
                games.forEach((g) => {
                    let newG = new ScoreTracker.Game(g.Id, g.Name);
                    newG.Players = g.Players;
                    newG.Rounds = g.Rounds;
                    loadedGames.push(newG);
                });
            }
            return loadedGames;
        }
        saveGameList() {
            this.storageService.saveValueToLocal(this.storageKey, this.$scope.gameList);
        }
    }
    ScoreTracker.ScoreTrackerController = ScoreTrackerController;
})(ScoreTracker || (ScoreTracker = {}));
var Services;
(function (Services) {
    class StorageService {
        constructor() {
            this.saveValueToLocal = function (key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            };
            this.getValueFromLocal = function (key) {
                let jsonValue = localStorage.getItem(key);
                if (jsonValue) {
                    return JSON.parse(jsonValue);
                }
                else {
                    return null;
                }
            };
            this.removeFromLocal = function (key) {
                localStorage.removeItem(key);
            };
        }
    }
    Services.StorageService = StorageService;
})(Services || (Services = {}));
var scoreTrackerApp = angular.module('scoreTrackerApp', ['ui.bootstrap']).service('storageService', Services.StorageService);
scoreTrackerApp.controller('scoreTrackerController', ScoreTracker.ScoreTrackerController);
//# sourceMappingURL=ScoreTracker.js.map
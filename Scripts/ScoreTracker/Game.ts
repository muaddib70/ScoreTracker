namespace ScoreTracker {

    export class Game {

        public Id: number
        public Name: string;
        public Players: ScoreTracker.Player[];
        public Rounds: Round[];

        constructor(id: number, name: string) {
            this.Id = id;
            this.Name = name;
            this.Players = [];
            this.Rounds = [];
        };

        public AddPlayer(name: string) {
            this.CheckForPlayers();
            let newId = this.Players.reduce(((prev, current) => {
                return (prev.Id > current.Id) ? prev : current;
            }), { Id: 0 }).Id + 1;

            this.Players.push({ Id: newId, Name: name, CurrentScore: 0 });
        }

        public getTotalPointsForPlayer(playerId: number) {
            let totalPoints: number = 0;
            this.CheckForPlayers();
            this.CheckForRounds();

            this.Rounds.forEach((round) => {
                let score: number = 0;
                round.PlayersPoints.forEach((playerPoints) => {
                    if (playerPoints.PlayerId == playerId) score = playerPoints.PlayerScore;
                });
                totalPoints += score;
            });

            return totalPoints;
        }

        public getRoundsCount() {
            this.CheckForRounds();
            return this.Rounds.length;
        }

        public AddRound() {
            this.CheckForRounds();

            let round = new Round();
            round.Id = this.Rounds.reduce(((prev, current) => { return (prev.Id > current.Id) ? prev : current; }), { Id: 0 }).Id + 1;

            this.Players.forEach((player) => {
                round.PlayersPoints.push(new PlayerPoints(player.Id, player.CurrentScore));
                player.CurrentScore = 0;
            });

            this.Rounds.push(round);
        }

        private CheckForPlayers() {
            if (this.Players == null) {
                this.Players = [];
            }
        }

        private CheckForRounds() {
            if (this.Rounds == null) {
                this.Rounds = [];
            }
        }
    }

    export class Round {
        constructor() { this.PlayersPoints = []; }
        Id: number;
        PlayersPoints: PlayerPoints[];
    }

    export class PlayerPoints {
        constructor(id: number, score: number) { this.PlayerId = id; this.PlayerScore = score; }
        PlayerId: number;
        PlayerScore: number;
    }
}
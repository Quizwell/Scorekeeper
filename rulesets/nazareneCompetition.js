const { isContext } = require("vm");

scoringEngine.rulesets.push({

    id: "nazareneCompetition",
    info: {
        name: "Competition",
        denominationId: "nazarene",
        denominationName: "Nazarene"
    },

    configurationOptions: {
        teamOptions: [
            
        ],
        quizzerOptions: [

        ],
        otherOptions: [
            {
                name: "Allow Five Seated Quizzers",
                type: "toggle",
                defaultValue: false,
                description: "When enabled, five quizzers can quiz at once. When disabled, the fifth quizzer must be substituted in and out."
            },
            {
                name: "Question Type Tracking",
                type: "toggle",
                defaultValue: true,
                description: "Track question types for the round and see how many of each type remain."
            },
            {
                name: "Chapter Counting",
                type: "toggle",
                defaultValue: true,
                description: "Track which chapters have already been used in questions and see which ones remain."
            }
        ]
    },

    matchLength: 20,
    overtime: {
        enabled: true,
        pointsGiven: false
    },
    questionTypes: [
        {
            name: "General",
            abbreviation: "G",
            quantity: 11
        },
        {
            name: "According To",
            abbreviation: "A",
            quantity: 4
        },
        {
            name: "Verse",
            abbreviation: "V",
            quantity: 1
        },
        {
            name: "Reference",
            abbreviation: "R",
            quantity: 1
        },
        {
            name: "Quote",
            abbreviation: "Q",
            quantity: 1
        },
        {
            name: "Context",
            abbreviation: "C",
            quantity: 1
        },
        {
            name: "Situation/In What Book and Chapter",
            abbreviation: "S/I",
            quantity: 1
        },
    ],

    minTeams: 1,
    maxTeams: 3,
    minQuizzers: 1,
    maxQuizzers: 4,

    templates: {
        team: {
            name: "",
            internal: {
                score: 0,
                bonus: 0,
                penalty: 0,
            },
            set score (value) {
                this.internal.score = value;
            },
            get score () {
                return this.internal.score;
            },
            get correct () {
                return this.sumOfQuizzerProperties("correct");
            },
            get incorrect () {
                return this.sumOfQuizzerProperties("incorrect");
            },
            get bonus () {
                return this.sumOfQuizzerProperties("bonus") + this.internal.bonus;
            },
            get penalty () {
                return this.sumOfQuizzerProperties("penalty") + this.internal.penalty;
            },
            get totalFouls () {
                return this.sumOfQuizzerProperties("fouls") + this.teamFouls;
            },
            get quizzerFouls () {
                return this.sumOfQuizzerProperties("fouls");
            },
            teamFouls: 0,
            get uniqueQuizzerJumps () {
                var number = 0;
                for (var quizzer in this.quizzers) {
                    if (quizzer.jumps > 0) {
                        number++;
                    }
                }
                return number;
            },
            overturnedChallenges: 0,
        },
        quizzer: {
            name: "",
            enabled: true,
            internal: {
                score: 0,
                bonus: 0,
                penalty: 0,
            },
            jumps: 0,
            correct: 0,
            incorrect: 0,
            fouls: 0,
            set score (value) {
                this.internal.score = value;
            },
            get score () {
                return this.internal.score;
            },
            correct: function () {
                this.jumps++;
                this.correct++;
                this.score += 20;
                //If the quizzer has quizzed out without error, add 10 bonus points.
                if (this.correct === 4 && this.incorrect === 0) {
                    this.score += 10;
                }
                //If this is a person bonus, add 10 bonus points to the team score.
                if (this.team.uniqueQuizzerJumps >= 3) {
                    this.team.bonus += 10;
                }
            },
            incorrect: function () {
                this.jumps++;
                this.incorrect++;
                //If the quizzer has errored out, disable him and deduct ten points. OR if this is the 5th+ team error os past question 16, deduct ten points from the team score.
                if (this.incorrect === 3) {
                    this.score -= 10;
                    this.enabled = false;
                } else if (this.team.incorrect >= 5 || scriptureEngine.context.question >= 16) {
                    this.team.score -= 10;
                }
            },
            set bonus (value) {
                this.internal.bonus = value;
            },
            get bonus () {
                return this.internal.bonus;
            },
            set penalty (value) {
                this.internal.penalty = value;
            },
            get penalty () {
                return this.internal.penalty;
            },
            set fouls (value) {
                this.incorrect.fouls = value;
            },
            get fouls () {
                return this.internal.fouls;
            }
        }
    },

    clocks: {
        matchClock: false,
        questionClock: 30,
        timeoutClock: 60
    },

    actions: {
        jump: [
            {
                label: "Correct",
                action: function (quizzer) {
                    quizzer.correct++;
                    scoringEngine.bridge.dismiss();
                }
            },
            {
                label: "Incorrect",
                action: function (quizzer) {
                    quizzer.incorrect++;
                    scoringEngine.bridge.dismiss();
                }
            },
            {
                label: "Cancel",
                action: function () {
                    scoringEngine.bridge.dismiss();
                }
            }
        ],
        bonus: [
            {
                label: "Correct",
                action: function (quizzer) {
                    quizzer.bonus++;
                    scoringEngine.bridge.dismiss();
                    
                }
            },
            {
                label: "Incorrect",
                action: function (quizzer) {
                    scoringEngine.bridge.dismiss();
                }
            },
        ]
    }

});

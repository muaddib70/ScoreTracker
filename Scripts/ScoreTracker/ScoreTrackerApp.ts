///<reference path="ScoreTrackerController.ts" />
///<reference path="StorageService.ts" />


var scoreTrackerApp = angular.module('scoreTrackerApp', ['ui.bootstrap']).service('storageService', Services.StorageService);


scoreTrackerApp.controller('scoreTrackerController', ScoreTracker.ScoreTrackerController);


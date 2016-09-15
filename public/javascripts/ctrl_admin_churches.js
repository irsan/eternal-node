var app = angular.module("EternalApp");

app.controller("adminChurchesCtrl", function($scope, rest) {
    console.log("ADMIN CHURCHES");

    $scope.newChurch = {};

    $scope.addChurch = function() {
        $scope.addChurchMode = true;
    };

    $scope.saveChurch = function() {
        rest.church.add($scope.newChurch, function(response) {
            console.log("RESPONSE: ", response);
        });
    };

    $scope.cancelAddChurch = function() {
        $scope.addChurchMode = false;
        $scope.newChurch = {};
    }
});
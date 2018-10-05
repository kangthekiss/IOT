
var app = angular.module("myApp", ["chart.js"]);
    
    app.config(['ChartJsProvider', function (ChartJsProvider) {
        ChartJsProvider.setOptions({
            chartColors: ['#FF5252', '#FF8A80'],
            responsive: false
        });
        ChartJsProvider.setOptions('bar', {
            showLines: false
        });
    }])
    app.controller("myCtrl", ['$scope', '$timeout', function ($scope, $timeout) {
    
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        30,20,5,15,0,-12,7
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
        console.log(setData);
    };
    
    //- $timeout(function () {
    //-     $scope.data = [
    //-     [28, 48, 40, 19, 86, 27, 90],
    //-     [65, 59, 80, 81, 56, 55, 40]
    //-     ];
    //- }, 3000);
}]);
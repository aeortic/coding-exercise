// app.js
// elapsed time: 4.5 hours

var calendarApp = angular.module('calendarApp', []);

calendarApp.factory('dispatch', function($rootScope, $broadcast){
    return function(payload) {
        $rootScope.$broadcast('message', payload);
    }
});

// Because this is a rather generic list, creating a factory allows it to be accessed anywhere.
calendarApp.factory('daysOfWeek', function() {
    return [
        'Su',
        'M',
        'T',
        'W',
        'Th',
        'F',
        'Sa'
    ]
});

calendarApp.controller('calendarCtrl', ['$http', '$scope', '$log', 'daysOfWeek', function($http, $scope, $log, daysOfWeek) {

    var setWeekStarting = function(page) {
        $scope.weekStartDate = moment().add(page, 'week').startOf('week');
        $scope.weekStartString = $scope.weekStartDate.format('MMM Do');
    };

    $scope.page = 0;
    setWeekStarting($scope.page);
    $scope.daysOfWeek = daysOfWeek;

    $scope.checkLowerLimit = function() {
        return ($scope.page != 0)
    };

    $scope.checkUpperLimit = function() {
        return ($scope.page != 12)
    };

    $scope.checkDisabled = function(type) {
        if (type == 'back') {
           if (!$scope.checkLowerLimit()) {
               return "disabled";
           }
        } else if (type == 'forward') {
            if (!$scope.checkUpperLimit()) {
                return "disabled";
            }
        }
    };

    $scope.pageBackward = function(){
        if ($scope.checkLowerLimit()) {
            $scope.page--;
            setWeekStarting($scope.page);
        }
    };

    $scope.pageForward = function(){
        if ($scope.checkUpperLimit()){
            $scope.page++;
            setWeekStarting($scope.page);
        }
    }

}]);

calendarApp.controller('dayCtrl', function($scope,$log){
    var thisDateString, pastDate;

    var getDate = function (index) {
        return $scope.weekStartDate.clone().add(index, 'days');
    };


    $scope.getDate = function (index) {
        //$log.log("getDate function");
        return getDate(index).format('DD');
    };

    $scope.getAvailability = function(index) {
        //$log.log("getAvailability function");
        var availability = "available";

        var thisDate = getDate(index);
        pastDate = moment().diff(thisDate, 'days');

        if (pastDate > 0) {
            availability = "unavailable";
        }

        angular.forEach(unavailableDates, function(value) {
            thisDateString = thisDate.format('YYYY-MM-DD');
            if (value == thisDateString) {
                availability = "unavailable";
            }
        });

        return availability;
    };


});

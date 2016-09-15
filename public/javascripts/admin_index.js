var app = angular.module('EternalApp', [ 'ngMaterial', 'ngRoute', 'pascalprecht.translate' ]);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/tpl/admin_dashboard',
        controller: 'adminDashboardCtrl',
    }).when('/churches', {
        templateUrl: '/tpl/admin_churches',
        controller: 'adminChurchesCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

app.controller('mainCtrl', function ($scope, $rootScope, $mdSidenav, $timeout) {
    $rootScope.me = me;

    $scope.toggleLeft = buildDelayedToggler('left');

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        }, 200);
    }

    $scope.goto = function(page) {
        $mdSidenav('left').close();
        window.location.href = "#" + page;
    }
});
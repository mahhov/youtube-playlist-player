angular.module('ytPlayer')
    .directive('toggle', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'toggleDirective/toggle.html',
            scope: {
                value: '=',
                icon: '=?',
                text: '=?'
            },
            controller: function ($scope) {
            }
        }
    });
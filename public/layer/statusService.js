angular.module('ytPlayer')
    .service('statusService', function () {
        var status = [];

        this.set = function (newStatus) {
            status = newStatus;
        };

        this.get = function () {
            return status;
        };
    });
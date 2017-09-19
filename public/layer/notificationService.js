angular.module('ytPlayer')
    .service('notificationService', function ($timeout, $document) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();

        this.notify = function (title, body) {
            new Notification(title, {
                body: body
            });
        };
    });
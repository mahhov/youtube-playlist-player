angular.module('ytPlayer')
    .service('shortcutService', function ($timeout, $document) {
        this.addShortcut = function (key, ctrl, shift, action) {
            $document.on('keydown', function (e) {
                if (e.key === key && (e.ctrlKey || !ctrl) && (e.shiftKey || !shift))
                    $timeout(action());
            });
        };
    });
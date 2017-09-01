angular.module('ytPlayer')
    .service('storeService', function () {
        this.savePlaylist = function (playlistId, playlistItems) {
            localStorage.setItem(playlistId + '-playlistItems', JSON.stringify(playlistItems));
        };

        this.loadPlaylist = function (playlistId) {
            return JSON.parse(localStorage.getItem(playlistId + '-playlistItems'));
        };
    });
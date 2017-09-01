angular.module('ytPlayer')
    .service('storeService', function () {
        this.savePlaylist = function (playlistId, playlistItems) {
            console.log('saving ', playlistId + '-playlistItems');
            localStorage.setItem(playlistId + '-playlistItems', JSON.stringify(playlistItems));
        };

        this.loadPlaylist = function (playlistId) {
            console.log('loading', playlistId + '-playlistItems');
            return JSON.parse(localStorage.getItem(playlistId + '-playlistItems'));
        };
    });
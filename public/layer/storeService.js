angular.module('ytPlayer')
    .service('storeService', function () {
        this.savePlaylist = function (playlistId, playlistItems) {
            localStorage.setItem(playlistId + '-playlistItems', JSON.stringify(playlistItems));
        };

        this.loadPlaylist = function (playlistId) {
            return JSON.parse(localStorage.getItem(playlistId + '-playlistItems'));
        };

        this.savePlaylistId = function (playlistId) {
            localStorage.setItem('playlistId', playlistId);
        };

        this.loadPlaylistId = function () {
            return localStorage.getItem('playlistId');
        };

        this.saveSettings = function (settings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        };

        this.loadSettings = function () {
            return JSON.parse(localStorage.getItem('settings'));
        };
    });
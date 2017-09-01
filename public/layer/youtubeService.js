angular.module('ytPlayer')
    .service('youtubeService', function ($window, $rootScope) {
        var googleApi = 'https://www.googleapis.com/youtube/v3/';
        var key = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
        var playerStale;
        var size = [390, 640];
        size = [100, 100];

        this.setInitFunction = function (initFunction) {
            $window.onYouTubePlayerAPIReady = function () {
                initFunction();
            };
        };

        this.createPlayer = function (divId, onReadyCallback, onVideoEndCallback) {
            var self = this;
            playerStale = new YT.Player(divId, {
                height: size[0],
                width: size[1],
                events: {
                    'onReady': function (event) {
                        onReadyCallback(playerStale = event.target);
                        $rootScope.$apply();
                    },
                    'onStateChange': function (event) {
                        if (event.data === 0)
                            onVideoEndCallback(event.target);
                    }
                }
            });
        };

        var fetchPlaylistPage = function (playlistId, pageToken) {
            var param = {
                key: key,
                part: 'snippet',
                maxResults: 50,
                playlistId: playlistId,
                pageToken: pageToken
            };
            var url = googleApi + 'playlistItems' + '?' + jQuery.param(param);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', url, false);
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        };

        this.fetchPlaylist = function (playlistId) {
            var playlistItems = [];
            var nextPageToken = '';
            do {
                var playlistPage = fetchPlaylistPage(playlistId, nextPageToken);
                nextPageToken = playlistPage.nextPageToken;
                _.each(playlistPage.items, function (item) {
                    playlistItems.push({
                        'name': item.snippet.title,
                        'id': item.snippet.resourceId.videoId
                    });
                });
            } while (nextPageToken);
            return playlistItems;
        };

        this.playVideo = function (player, videoId) {
            (player ? player : playerStale ).loadVideoById(videoId);
        };
    });
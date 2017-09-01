angular.module('ytPlayer')
    .service('youtubeService', function ($window, $rootScope) {
        var googleApi = 'https://www.googleapis.com/youtube/v3/';
        var key = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
        var playerStale;
        var getNextVideoId;

        this.setInitFunction = function (initFunction) {
            $window.onYouTubePlayerAPIReady = function () {
                initFunction();
                setTimeout(function () {
                    $rootScope.$apply();
                });
            };
        };

        this.createPlayer = function (divId, getNextVideoIdFunction) {
            var self = this;
            getNextVideoId = getNextVideoIdFunction;
            playerStale = new YT.Player(divId, {
                height: '100',
                width: '100',
                // height: '390',
                // width: '640',
                events: {
                    'onReady': function (event) {
                        self.playNext(playerStale = event.target);
                    },
                    'onStateChange': function (event) {
                        if (event.data === 0)
                            self.playNext(event.target);
                    }
                }
            });
        };

        var retrievePlaylistPage = function (playlistId, pageToken) {
            var param = {
                key: key,
                part: 'snippet',
                maxResults: 50,
                playlistId: playlistId,
                pageToken: pageToken
            };
            var url = googleApi + 'playlistItems' + '?' + jQuery.param(param);
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
            return JSON.parse(xmlHttp.responseText);
        };

        this.fetchPlaylist = function (playlistId) {
            var playlistItems = [];
            var nextPageToken = '';
            do {
                var playlistPage = retrievePlaylistPage(playlistId, nextPageToken);
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

        this.playNext = function (player) {
            (player ? player : playerStale ).loadVideoById(getNextVideoId());
        };
    });
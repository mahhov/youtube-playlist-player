angular.module('ytPlayer')
    .service('youtubeService', function ($window, $rootScope, $http, statusService) {
            var googleApi = 'https://www.googleapis.com/youtube/v3/';
            var key = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
            var playerStale;
            var size = [390, 640];
            var paused;
            var playingVideoId;

            this.setInitFunction = function (initFunction) {
                if (!$window.YT) {
                    console.log('1');
                    $window.onYouTubePlayerAPIReady = initFunction;
                } else if ($window.YT.loaded) {
                    console.log('2');
                    initFunction();
                } else {
                    console.log('3');
                    $window.YT.ready(initFunction);
                }
            };

            this.createPlayer = function (divId, onReadyCallback, onVideoEndCallback) {
                statusService.set(['creating initializing']);
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

            var fetchPlaylistPage = function (playlistId, pageToken, callback) {
                statusService.set(['fetch ' + pageToken]);
                var param = {
                    key: key,
                    part: 'snippet',
                    maxResults: 50,
                    playlistId: playlistId,
                    pageToken: pageToken
                };
                var url = googleApi + 'playlistItems' + '?' + jQuery.param(param);
                $http.get(url).success(function (data) {
                    callback(data);
                });
            };

            this.fetchPlaylist = function (playlistId, callback) {
                var playlistItems = [];
                var perPage = function (playlistPage) {
                    _.each(playlistPage.items, function (item) {
                        playlistItems.push({
                            'name': item.snippet.title,
                            'id': item.snippet.resourceId.videoId
                        });
                    });
                    if (playlistPage.nextPageToken)
                        fetchPlaylistPage(playlistId, playlistPage.nextPageToken, perPage);
                    else
                        callback(playlistItems);
                };
                fetchPlaylistPage(playlistId, '', perPage);
            };

            this.rewindVideo = function () {
                this.playVideo(null, playingVideoId);
            };

            this.pauseVideo = function () {
                paused = true;
                playerStale.pauseVideo();
            };

            this.resumeVideo = function () {
                paused = false;
                playerStale.playVideo();
            };

            this.playVideo = function (player, videoId) {
                playingVideoId = videoId;
                (player ? player : playerStale).loadVideoById(videoId);
            };

            this.isPaused = function () {
                return paused;
            }
        }
    );
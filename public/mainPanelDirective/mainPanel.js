angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, $window, shortcutService) {
                var googleApi = 'https://www.googleapis.com/youtube/v3/';
                var key = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
                var playlistId = "PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2";

                $scope.playlistItems = [];
                $scope.player = {};
                $scope.statusLines = {};

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

                var fetchPlaylist = function (playlistId) {
                    console.log('fetching playlist');
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

                var createPlayer = function (onPlayerReadyCallback, videEndCallback) {
                    return player = new YT.Player('playerDiv', {
                        height: '10',
                        width: '10',
                        // height: '390',
                        // width: '640',
                        events: {
                            'onReady': onPlayerReadyCallback,
                            'onStateChange': function (event) {
                                if (event.data === 0) {
                                    videEndCallback(event);
                                }
                            }
                        }
                    });
                };

                var savePlaylist = function () {
                    localStorage.setItem('playlistItems', JSON.stringify($scope.playlistItems));
                };

                var loadPlaylist = function () {
                    $scope.playlistItems = JSON.parse(localStorage.getItem('playlistItems'));
                };

                $scope.resetPlaylist = function () {
                    localStorage.removeItem('playlistItems');
                    $scope.playlistItems = fetchPlaylist(playlistId);
                    savePlaylist($scope.playlistItems);
                };

                $scope.playRandom = function (player) {
                    var videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    setStatus(videoIndex);
                    player.loadVideoById($scope.playlistItems[videoIndex].id);
                };

                $scope.init = function () {
                    loadPlaylist();
                    if (!$scope.playlistItems) {
                        resetPlaylist();
                    }

                    createPlayer(function (event) {
                        $scope.playRandom($scope.player = event.target);
                    }, function (event) {
                        $scope.playRandom(event.target);
                    });
                };

                $window.onYouTubePlayerAPIReady = function () {
                    $scope.init();
                    setTimeout(function () {
                        $scope.$apply();
                    });
                };

                var setStatus = function (videoIndex) {
                    $scope.statusLines = [];
                    $scope.statusLines[0] = 'playing';
                    $scope.statusLines[1] = $scope.playlistItems[videoIndex].name;
                    $scope.statusLines[2] = videoIndex + ' of ' + $scope.playlistItems.length;
                };

                // shortcutService.addShortcut('t', true, false, $scope.addPairCallback);
                // shortcutService.addShortcut('w', true, false, $scope.closePairCallback);
                // shortcutService.addShortcut('Enter', false, true, $scope.addSessionCallback);
                // shortcutService.addShortcut('[', true, false, $scope.selectPairLeft);
                // shortcutService.addShortcut(']', true, false, $scope.selectPairRight);
            }
        }
    });
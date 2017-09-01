angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, storeService, youtubeService) {
                $scope.playlistId = 'PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2';
                $scope.playlistItems = [];
                $scope.statusLines = ['initializing'];
                $scope.showVideo = true;

                $scope.init = function () {
                    $scope.loadPlaylist();
                    youtubeService.createPlayer('playerDiv', $scope.nextPlaylistItem, $scope.nextPlaylistItem);
                };

                $scope.loadPlaylist = function () {
                    $scope.playlistItems = storeService.loadPlaylist($scope.playlistId);
                    if (!$scope.playlistItems)
                        resetPlaylist();
                };

                $scope.resetPlaylist = function () {
                    $scope.statusLines = ['fetching playlist data', 'playlist id: ' + $scope.playlistId];
                    youtubeService.fetchPlaylist($scope.playlistId, function (playlistItems) {
                        $scope.playlistItems = playlistItems;
                        storeService.savePlaylist($scope.playlistId, $scope.playlistItems);
                        $scope.statusLines = ['fetched playlist data', 'playlist id: ' + $scope.playlistId, $scope.playlistItems.length + ' videos'];
                    });
                };

                var getNextVideoId = function (player) {
                    var videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    $scope.statusLines = ['playing', $scope.playlistItems[videoIndex].name, videoIndex + ' of ' + $scope.playlistItems.length];
                    return $scope.playlistItems[videoIndex].id;
                };

                $scope.nextPlaylistItem = function () {
                    youtubeService.playVideo(null, getNextVideoId())
                };

                youtubeService.setInitFunction($scope.init);

                // shortcutService.addShortcut('t', true, false, $scope.addPairCallback);
                // shortcutService.addShortcut('w', true, false, $scope.closePairCallback);
                // shortcutService.addShortcut('Enter', false, true, $scope.addSessionCallback);
                // shortcutService.addShortcut('[', true, false, $scope.selectPairLeft);
                // shortcutService.addShortcut(']', true, false, $scope.selectPairRight);
            }
        }
    });
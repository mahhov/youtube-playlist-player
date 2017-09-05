angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, statusService, storeService, youtubeService) {
                $scope.playlistId = 'PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2';
                $scope.playlistItems = [];
                statusService.set(['initializing']);
                $scope.showVideo = true;

                $scope.init = function () {
                    statusService.set(['begin initializing']);
                    $scope.loadPlaylist();
                    youtubeService.createPlayer('playerDiv', $scope.nextPlaylistItem, $scope.nextPlaylistItem);
                };

                $scope.loadPlaylist = function () {
                    $scope.playlistItems = storeService.loadPlaylist($scope.playlistId);
                    if (!$scope.playlistItems)
                        $scope.resetPlaylist();
                };

                $scope.resetPlaylist = function () {
                    statusService.set(['fetching playlist data', 'playlist id: ' + $scope.playlistId]);
                    youtubeService.fetchPlaylist($scope.playlistId, function (playlistItems) {
                        $scope.playlistItems = playlistItems;
                        storeService.savePlaylist($scope.playlistId, $scope.playlistItems);
                        statusService.set(['fetched playlist data', 'playlist id: ' + $scope.playlistId, $scope.playlistItems.length + ' videos']);
                    });
                };

                var getNextVideoId = function (player) {
                    var videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    statusService.set(['playing', $scope.playlistItems[videoIndex].name, videoIndex + ' of ' + $scope.playlistItems.length]);
                    return $scope.playlistItems[videoIndex].id;
                };

                $scope.pausePlaylistItem = function () {
                    youtubeService.pauseVideo();
                };

                $scope.resumePlaylistItem = function () {
                    youtubeService.resumeVideo();
                };

                $scope.nextPlaylistItem = function () {
                    youtubeService.playVideo(null, getNextVideoId())
                };

                $scope.showPause = function () {
                    return !youtubeService.isPaused();
                };

                $scope.getStatus = function () {
                    return statusService.get();
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
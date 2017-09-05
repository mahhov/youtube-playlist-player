angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, statusService, storeService, youtubeService) {
                statusService.set(['begin']);
                var videoIndex = -1;

                $scope.init = function () {
                    statusService.set(['initializing']);
                    $scope.playlistId = storeService.loadPlaylistId() || 'PL8B378392000F267B';
                    $scope.playlistItems = [];
                    $scope.showVideo = true;
                    var settings = storeService.loadSettings() || {};
                    $scope.shuffle = settings.shuffle;
                    $scope.showVideo = settings.showVideo;
                    $scope.loadPlaylist();
                    youtubeService.createPlayer('playerDiv', $scope.nextPlaylistItem, $scope.nextPlaylistItem);
                };

                $scope.loadPlaylist = function () {
                    $scope.playlistItems = storeService.loadPlaylist($scope.playlistId);
                    if (!$scope.playlistItems)
                        $scope.resetPlaylist();
                    storeService.savePlaylistId($scope.playlistId);
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
                    if ($scope.shuffle)
                        videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    else
                        videoIndex++;
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

                $scope.saveSettings = function () {
                    storeService.saveSettings({'shuffle': $scope.shuffle, 'showVideo': $scope.showVideo});
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
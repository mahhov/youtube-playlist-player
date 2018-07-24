angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, notificationService, statusService, storeService, youtubeService) {
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

                var getNextVideoIndex = function (player) {
                    if ($scope.shuffle)
                        videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    else
                        videoIndex++;
                    statusService.set(['playing ' + videoIndex + ' of ' + $scope.playlistItems.length, $scope.playlistItems[videoIndex].name]);
                    return videoIndex;
                };

                $scope.pausePlaylistItem = function () {
                    if ($scope.isPaused())
                        youtubeService.resumeVideo();
                    else
                        youtubeService.pauseVideo();
                };

                $scope.nextPlaylistItem = function () {
                    $scope.setPlayListItem(getNextVideoIndex());
                };

                $scope.setPlayListItem = function (videoIndex) {
                    notificationService.notify($scope.playlistItems[videoIndex].name);
                    youtubeService.playVideo(null, $scope.playlistItems[videoIndex].id)
                };

                $scope.isPaused = function () {
                    return youtubeService.isPaused();
                };

                $scope.getStatus = function () {
                    return statusService.get();
                };

                $scope.saveSettings = function () {
                    storeService.saveSettings({
                        'shuffle': $scope.shuffle,
                        'showVideo': $scope.showVideo,
                        'playControlsOnly': $scope.playControlsOnly
                    });
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
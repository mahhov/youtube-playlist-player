angular.module('ytPlayer')
    .directive('mainPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'mainPanelDirective/mainPanel.html',
            scope: {},
            controller: function ($scope, storeService, youtubeService) {
                var defaultPlaylistId = "PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2";

                $scope.playlistItems = [];
                $scope.player = {};
                $scope.statusLines = {};

                var getNextVideoId = function (player) {
                    var videoIndex = Math.floor(Math.random() * $scope.playlistItems.length);
                    setStatus(videoIndex);
                    return $scope.playlistItems[videoIndex].id;
                };

                $scope.init = function () {
                    $scope.loadPlaylist(defaultPlaylistId);
                    youtubeService.createPlayer('playerDiv', $scope.nextPlaylistItem, $scope.nextPlaylistItem);
                };

                youtubeService.setInitFunction($scope.init);

                var setStatus = function (videoIndex) {
                    $scope.statusLines = [];
                    $scope.statusLines[0] = 'playing';
                    $scope.statusLines[1] = $scope.playlistItems[videoIndex].name;
                    $scope.statusLines[2] = videoIndex + ' of ' + $scope.playlistItems.length;
                };

                $scope.loadPlaylist = function (playlistId) {
                    $scope.playlistItems = storeService.loadPlaylist() || youtubeService.fetchPlaylist(playlistId);
                };

                $scope.resetPlaylist = function () {

                };

                $scope.nextPlaylistItem = function () {
                    youtubeService.playVideo(null, getNextVideoId())
                };

                // shortcutService.addShortcut('t', true, false, $scope.addPairCallback);
                // shortcutService.addShortcut('w', true, false, $scope.closePairCallback);
                // shortcutService.addShortcut('Enter', false, true, $scope.addSessionCallback);
                // shortcutService.addShortcut('[', true, false, $scope.selectPairLeft);
                // shortcutService.addShortcut(']', true, false, $scope.selectPairRight);
            }
        }
    });
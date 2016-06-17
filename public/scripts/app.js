'use strict';

var app = angular.module('myApp', []);

/* Controllers */
app.controller('AppCtrl', function ($scope, socket) {

  $scope.users = [];
  $scope.curtrentUser = '';
  socket.on('connect', function () { });

  socket.on('updatechat', function (username, data) {
    var user = {};
    user.username = username;
    user.message = data;
    user.date = new Date().getTime();
    user.image = 'http://dummyimage.com/250x250/000/fff&text=' + username.charAt(0).toUpperCase();
    $scope.users.push(user);
  });

  socket.on('roomcreated', function (data) {
    socket.emit('adduser', data);
  });

  $scope.createRoom = function (data) {
    $scope.curtrentUser = data.username;
    socket.emit('createroom', data);
  }

  $scope.joinRoom = function (data) {
    $scope.curtrentUser = data.username;
    socket.emit('adduser', data);
  }

  $scope.doPost = function (message) {
    socket.emit('sendchat', message);
  }
});


/* Services */
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
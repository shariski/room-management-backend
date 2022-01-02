'use strict';
var tokenController = require('../controllers/tokenController');

module.exports = function(app) {
    var roomCtrl = require('../controllers/roomController');

    app.route('/room')
        .post(roomCtrl.createRoom);

    app.route('/room')
        .get(roomCtrl.getRoom);

    app.route('/room/:roomId')
        .put(roomCtrl.editRoom);

    app.route('/room/:roomId')
        .delete(roomCtrl.deleteRoom);
};
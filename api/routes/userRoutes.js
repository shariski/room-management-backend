'use strict';
var tokenController = require('../controllers/tokenController');

module.exports = function(app) {
    var userCtrl = require('../controllers/userController');

    //USER-------------
    app.route('/users')
        .post(userCtrl.createUser);

    app.route('/users')
        .get(userCtrl.getUser);

    app.route('/users/login')
        .post(userCtrl.loginUser);

    app.route('/users/search')
        .get(tokenController, userCtrl.searchUser);

    app.route('/users/password')
        .patch(tokenController, userCtrl.changePassword);

};
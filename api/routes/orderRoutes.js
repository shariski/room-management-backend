'use strict';
var tokenController = require('../controllers/tokenController');

module.exports = function(app) {
    var orderCtrl = require('../controllers/orderController');

    app.route('/order')
        .post(orderCtrl.createOrder);

    app.route('/order')
        .get(orderCtrl.getOrder);

    app.route('/order/:idOrder')
        .put(orderCtrl.editOrder);

    app.route('/order/:idOrder')
        .delete(orderCtrl.deleteOrder);
};
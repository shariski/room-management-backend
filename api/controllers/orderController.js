// Load required packages
var Order = require('../models/orderModel');

Date.prototype.addHours = function(h){
  this.setHours(this.getHours()+h);
  return this;
}

// Create endpoint /api/users for POST
exports.createOrder = function(req, res) {
  var order = new Order({
    custId: req.body.custId,
    roomId: req.body.roomId,
    date: req.body.date,
    time: req.body.time
  });
    order.save(function(err) {
        if (err){
        return res.status(409).json(err);
        };
        return res.json({msg:"order created"});
    });
};

exports.getOrder = function(req, res){
    Order.find({})
        .exec(function(err, docs){
            if(err) res.status(500).json({
                error: err
            })
            res.status(200).json(docs)
        })
};

exports.editOrder = function(req, res){
    console.log(req.body)
    Order.findOneAndUpdate(
      { _id: req.params.idOrder }, { $set: { 
        status: req.body.status
      }}
    )
    .exec()
      .then(result => {
          res.status(200).json({
              result,
              message: "Order updated",
          });
      })
      .catch(err => {
          res.status(500).json({
              error: err
          });
      })
  }

exports.deleteOrder = function(req, res){
    Order.findOneAndRemove(
        {_id: req.params.idOrder}
    )
    .exec()
    .then(result => {
        if (result) res.status(200).json({result, message: 'order deleted'});
        else res.status(401).json('order not found')
    })
}
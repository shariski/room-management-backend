// Load required packages
var Room = require('../models/roomModel');

Date.prototype.addHours = function(h){
  this.setHours(this.getHours()+h);
  return this;
}

// Create endpoint /api/users for POST
exports.createRoom = function(req, res) {
  var room = new Room({
    name: req.body.name,
    floor: req.body.floor,
    capacity: req.body.capacity,
    description: req.body.description,
    facility: req.body.facility
  });
    room.save(function(err) {
        if (err){
        return res.status(409).json(err);
        };
        return res.json({msg:"room created"});
    });
};

exports.getRoom = function(req, res){
    Room.find({})
        .exec(function(err, docs){
            if(err) res.status(500).json({
                error: err
            })
            res.status(200).json(docs)
        })
};

exports.editRoom = function(req, res){
    Room.findOneAndUpdate(
      { _id: req.body.idRoom }, { $set: { 
        name: req.body.name,
        floor: req.body.floor,
        capacity: req.body.number,
        description: req.body.role,
        facility: req.body.facility,
        status: req.body.status
      }}
    )
    .exec()
      .then(result => {
          res.status(200).json({
              result,
              message: "Room updated",
              request: {
                  type: "PATCH"
              }
          });
      })
      .catch(err => {
          res.status(500).json({
              error: err
          });
      })
  }

exports.deleteRoom = function(req, res){
    Room.findOneAndRemove(
        {_id: req.body.idRoom}
    )
    .exec()
    .then(result => {
        if (result) res.status(200).json({result, message: 'room deleted'});
        else res.status(401).json('room not found')
    })
}
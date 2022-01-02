// Load required packages
var User = require('../models/userModel');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

Date.prototype.addHours = function(h){
  this.setHours(this.getHours()+h);
  return this;
}

// Create endpoint /api/users for POST
exports.createUser = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  });

  user.save(function(err) {
    if (err){
      return res.status(409).json(err);
    };
    return res.json({msg:"user created"});
  });
};

exports.loginUser = function(req, res) {
  User.findOne({ username: req.body.username })
  .exec()
  .then(user =>
  {
    if (!user) 
    {
      return res.status(401).json({msg:'user not found'});
    }
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) { return res.status(401).json(err) }

      // Password did not match
      if (!isMatch) { return res.status(401).json({msg:'wrong password'}) }

      // Success
      token = jwt.sign({
        username: user.username,
        userId: user._id,
        name: user.name,
        role: user.role
      }, 
      'secretkey');
      res.json({tokenUser:token});
    });
  })
}

exports.changePassword = function(req, res) {
  User.findOne({ username: req.userData.username })
  .exec()
  .then(user =>
  {
    if (!user) 
    {
      return res.status(401).json('user not found');
    }
    user.verifyPassword(req.body.old_password, function(err, isMatch) {
      if (err) { return res.status(401).json(err) }

      // Password did not match
      if (!isMatch) { return res.status(401).json('wrong password') }

      bcrypt.genSalt(5, function(err, salt) {
        if (err) return res.json(err)
    
        bcrypt.hash(req.body.new_password, salt, null, function(err, hash) {
          if (err) return res.json(err)

          User.findOneAndUpdate(
            {username: req.userData.username}, { $set: { password: hash }}
          )
          .exec()
            .then(result => {
                res.status(200).json({
                    result,
                    message: "Password updated",
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
        });
      });

      
    });
  })
}

exports.getUser = function(req, res) {
  var populateQuery = [{path:'friends.friendId', select:'username name'}];

  User.findById(req.userData.userId, '_id username name email pemasukan pengeluaran friends')
    .populate(populateQuery)
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
          error: err
      });
  })
};

exports.searchUser = function(req, res) {
  User.findOne({username: req.query.username}, 'name username _id',
    function(err, model){
      console.log(err); 
    }).exec(function (err, result){ 
      if (err) return res.status(500).json(err);
      if (result.username==req.userData.username || result==null) res.json({msg: 'user not found'});
      return res.status(200).json({msg:'user found',result}); 
    });
};

exports.addExperience = function(req, res){
  var experience = {
    title : req.body.title,
    startDate : new Date(req.body.startDate),
    endDate: new Date(req.body.endDate)
  }
  User.findOneAndUpdate(
    { _id: req.userData.userId }, { $push: { 
      experience: experience
    }, function(err, model) {
      console.log(err);
  }}
)
.exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
}

exports.editExperience = function (req, res) {
  User.findOneAndUpdate({"experience._id": req.body.experienceId}, { $set: {
          "experience.$.title": req.body.title,
          "experience.$.startDate": new Date(req.body.startDate),
          "experience.$.endDate": new Date(req.body.endDate)
          } 
      }, {new: true}, function(err, result){
          if(err){
              return res.status(401).json(err);
          }
          return res.status(200).json(result);
      })
      
};

exports.deleteExperience = function (req, res) {
  User.findOne({'experience._id': req.body.experienceId})
  .exec()
  .then(result => {
    if (!result) return res.status(500).json({msg: 'experience not found'})
    else {
      User.findOneAndUpdate(
        { _id: req.userData.userId }, { $pull: { 
          experience: {_id: req.body.experienceId}
        }, function(err, model) {
          console.log(err);
      }}
      )
      .exec()
        .then(result => {
          res.status(200).json({msg: 'experience deleted'});
        })
        .catch(err => {
          res.status(500).json({
              error: err
          });
        })
    }
  })
  .catch(err => {
    res.status(500).json({
        error: err
    });
  })
};

exports.experience = function(req, res) {
  User.findOne({'experience._id': req.query.experienceId}, {'experience.$': 1})
  .exec(function (err, result){ 
    if (err) return res.status(500).json({err,msg:'experience not found'});
    return res.status(200).json(result); 
  });
};
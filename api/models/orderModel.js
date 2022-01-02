var mongoose = require('mongoose');

// Define our user schema
var OrderSchema = new mongoose.Schema({
  custId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Number,
    max: 24,
    min: 0
  },
  status: {
    type: String,
    enum: ['approval', 'approved', 'rejected'],
    default: 'approval'
  },
  rejectedMessage: {
    type: String
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Order', OrderSchema);
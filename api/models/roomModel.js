var mongoose = require('mongoose');

// Define our user schema
var RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  floor:{
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  facility: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'deactive', 'maintenance'],
    default: 'active'
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Room', RoomSchema);
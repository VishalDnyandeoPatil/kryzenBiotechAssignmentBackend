const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    // photo: { type: Buffer, required: true }
    photoUrl: { type: String, required: true }
  },{ timestamps: true });
  

module.exports = mongoose.model('FormData', formDataSchema);

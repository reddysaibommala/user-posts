const mongoose = require('mongoose');

let VoteSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    auto: true
  },
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  uid: String,
  createdAt: { type: Date },
  updatedAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

VoteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Vote = mongoose.model('Vote', VoteSchema, 'votes');
module.exports = { Vote };
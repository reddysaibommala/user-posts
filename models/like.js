const mongoose = require('mongoose');

let LikeSchema = new mongoose.Schema({
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

LikeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Like = mongoose.model('Like', LikeSchema, 'likes');
module.exports = { Like };
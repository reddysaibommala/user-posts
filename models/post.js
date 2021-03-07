const mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    auto: true
  },
  uid: String,
  title: String,
  description: String,
  attachment: {
    label: String,
    url: String,
    key: String
  },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

PostSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model('Post', PostSchema, 'posts');
module.exports = { Post };
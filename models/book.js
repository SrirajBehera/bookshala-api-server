const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  author: [{
    type: String,
    required: true
  }],
  edition: {
    type: String,
    required: true
  },
  publication_year: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  seller: {
    type: ObjectId,
    ref: "Seller"
  }
}, {
  // will automatically give a timestamp of createdAt and updatedAt
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

mongoose.model("Book", bookSchema);
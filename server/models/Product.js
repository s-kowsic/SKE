const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, default: 0 },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

// Optional text index for simple searches alongside AI search
productSchema.index({ name: 'text', description: 'text', type: 'text' });

module.exports = mongoose.model('Product', productSchema);

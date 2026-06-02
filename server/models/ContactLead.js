const mongoose = require('mongoose');

const contactLeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  requirement: { type: String, required: true },
  quantity: { type: Number },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' }
}, { timestamps: true });

module.exports = mongoose.model('ContactLead', contactLeadSchema);

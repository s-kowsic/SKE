const ContactLead = require('../models/ContactLead');
const RestockRequest = require('../models/RestockRequest');
const { sendAdminQuoteEmail, sendRestockAckEmail } = require('../utils/emailService');

const submitContactForm = async (req, res) => {
  const { name, email, phone, requirement, quantity } = req.body;

  if (!name || !email || !requirement) {
    return res.status(400).json({ message: 'Name, email, and requirement are required fields.' });
  }

  try {
    const lead = new ContactLead({
      name,
      email,
      phone,
      requirement,
      quantity
    });

    const savedLead = await lead.save();
    
    // Trigger email notification to admin
    await sendAdminQuoteEmail({ name, email, phone, requirement, quantity });
    
    res.status(201).json({ message: 'Your enquiry has been submitted successfully!', leadId: savedLead._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error while submitting form.', error: error.message });
  }
};

const requestRestock = async (req, res) => {
  const { email, productId, productName } = req.body;

  if (!email || !productId || !productName) {
    return res.status(400).json({ message: 'Email, productId, and productName are required fields.' });
  }

  try {
    const existingRequest = await RestockRequest.findOne({ email, productId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested a notification for this product.' });
    }

    const restockReq = new RestockRequest({ email, productId, productName });
    await restockReq.save();

    // Send acknowledgement email to user
    await sendRestockAckEmail(email, productName);

    res.status(201).json({ message: 'Restock notification requested successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while requesting restock.', error: error.message });
  }
};

module.exports = { submitContactForm, requestRestock };

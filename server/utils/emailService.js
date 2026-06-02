const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendAdminQuoteEmail = async (leadDetails) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping quote email to admin.');
    return;
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending to admin's own email
    subject: `New Quote Request from ${leadDetails.name}`,
    html: `
      <h3>New Quote Request Received</h3>
      <p><strong>Name:</strong> ${leadDetails.name}</p>
      <p><strong>Email:</strong> ${leadDetails.email}</p>
      <p><strong>Phone:</strong> ${leadDetails.phone || 'N/A'}</p>
      <p><strong>Quantity:</strong> ${leadDetails.quantity || 'N/A'}</p>
      <p><strong>Requirement:</strong></p>
      <p>${leadDetails.requirement}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Quote request email sent to admin successfully.');
  } catch (error) {
    console.error('Error sending quote request email:', error);
  }
};

const sendRestockAckEmail = async (email, productName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping restock acknowledgement email.');
    return;
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Restock Notification Requested: ${productName}`,
    html: `
      <h3>Hi there,</h3>
      <p>You have successfully subscribed to receive a notification when <strong>${productName}</strong> is back in stock.</p>
      <p>We will email you as soon as it's available!</p>
      <br />
      <p>Best regards,<br/>Sri Krishna Engineering Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Restock acknowledgement email sent successfully.');
  } catch (error) {
    console.error('Error sending restock acknowledgement email:', error);
  }
};

module.exports = {
  sendAdminQuoteEmail,
  sendRestockAckEmail,
};

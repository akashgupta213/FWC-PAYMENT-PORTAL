require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP ERROR:', error);
  } else {
    console.log('SMTP connected successfully!');
  }
});

transporter.sendMail({
  from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
  to: process.env.SMTP_USER,   // sends to yourself for testing
  subject: 'Test Email',
  html: '<h1>Test email working!</h1>'
}, (err, info) => {
  if (err) {
    console.log('SEND ERROR:', err);
  } else {
    console.log('Email sent successfully!', info.response);
  }
});
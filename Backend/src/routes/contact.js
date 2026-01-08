const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage (replace with database in production)
const contactSubmissions = [];

// Input validation middleware
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
    .escape(), // XSS protection
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email must be less than 255 characters'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject must be less than 200 characters')
    .escape(),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 2000 }).withMessage('Message must be less than 2000 characters')
    .escape()
];

// Email transporter (configure with your SMTP settings)
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

// POST /api/contact - Submit contact form
router.post('/', validateContact, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => e.msg) 
      });
    }

    const { name, email, subject, message } = req.body;

    // Create submission record
    const submission = {
      id: uuidv4(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      ip: req.ip // For rate limiting/spam detection
    };

    // Store submission
    contactSubmissions.push(submission);
    console.log('New contact submission:', submission.id);

    // Send email notification (if configured)
    const transporter = createTransporter();
    if (transporter && process.env.CONTACT_EMAIL) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL,
          subject: `[GauChara Contact] ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted at: ${submission.createdAt}</small></p>
          `
        });
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      id: submission.id
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit contact form. Please try again.' 
    });
  }
});

// GET /api/contact - Get all submissions (admin only - add auth in production)
router.get('/', (req, res) => {
  // In production, add authentication middleware
  res.json({
    success: true,
    count: contactSubmissions.length,
    submissions: contactSubmissions.slice(-50) // Return last 50
  });
});

module.exports = router;

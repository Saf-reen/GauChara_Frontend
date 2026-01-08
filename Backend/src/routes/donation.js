const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory storage (replace with database in production)
const donations = [];

// Initialize Stripe (if configured)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Validation middleware
const validateDonation = [
  body('amount')
    .isInt({ min: 100, max: 10000000 }).withMessage('Amount must be between ₹100 and ₹1,00,000'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('paymentMethod')
    .isIn(['card', 'paypal', 'bank']).withMessage('Invalid payment method')
];

// POST /api/donation/create-payment-intent - Create Stripe payment intent
router.post('/create-payment-intent', validateDonation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(e => e.msg) 
      });
    }

    const { amount, currency = 'INR', name, email, paymentMethod } = req.body;

    // If Stripe is not configured, return mock response for testing
    if (!stripe) {
      console.log('Stripe not configured - returning mock response');
      const mockDonation = {
        id: uuidv4(),
        amount,
        currency,
        name: name || 'Anonymous',
        email,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      donations.push(mockDonation);
      
      return res.json({
        success: true,
        clientSecret: 'mock_client_secret_' + mockDonation.id,
        donationId: mockDonation.id,
        message: 'Payment intent created (test mode)'
      });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (paise for INR)
      currency: currency.toLowerCase(),
      metadata: {
        name: name || 'Anonymous',
        email: email || '',
        organization: 'GauChara - Savadia Foundation'
      },
      description: 'Donation to GauChara for cow welfare'
    });

    // Store donation record
    const donation = {
      id: uuidv4(),
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      name: name || 'Anonymous',
      email,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    donations.push(donation);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      donationId: donation.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process donation. Please try again.' 
    });
  }
});

// POST /api/donation/confirm - Confirm donation (for non-Stripe methods)
router.post('/confirm', async (req, res) => {
  try {
    const { donationId, transactionId, paymentMethod } = req.body;

    // Find and update donation
    const donation = donations.find(d => d.id === donationId);
    if (donation) {
      donation.status = 'completed';
      donation.transactionId = transactionId;
      donation.completedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      message: 'Thank you for your generous donation! Your contribution will help nourish many sacred cows.',
      donationId,
      receipt: {
        id: donationId,
        amount: donation?.amount,
        date: new Date().toISOString(),
        organization: 'GauChara - Savadia Foundation'
      }
    });

  } catch (error) {
    console.error('Donation confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to confirm donation.' 
    });
  }
});

// GET /api/donation/bank-details - Get bank transfer details
router.get('/bank-details', (req, res) => {
  res.json({
    success: true,
    bankDetails: {
      bankName: 'State Bank of India',
      accountName: 'Savadia Foundation - GauChara',
      accountNumber: '1234567890123456',
      ifscCode: 'SBIN0001234',
      swiftCode: 'SBININBB',
      branch: 'Ahmedabad Main Branch',
      address: 'Gaushala Road, Ahmedabad, Gujarat 380001, India'
    }
  });
});

// POST /api/donation/webhook - Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(400).json({ error: 'Webhook not configured' });
  }

  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Update donation status in database
        const donation = donations.find(d => d.stripePaymentIntentId === paymentIntent.id);
        if (donation) {
          donation.status = 'completed';
          donation.completedAt = new Date().toISOString();
        }
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
});

// GET /api/donation/stats - Get donation statistics
router.get('/stats', (req, res) => {
  const completed = donations.filter(d => d.status === 'completed');
  const totalAmount = completed.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    success: true,
    stats: {
      totalDonations: completed.length,
      totalAmount,
      cowsFed: Math.floor(totalAmount / 500), // ₹500 feeds 1 cow for a week
      recentDonations: completed.slice(-5).map(d => ({
        name: d.name,
        amount: d.amount,
        date: d.createdAt
      }))
    }
  });
});

module.exports = router;

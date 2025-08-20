const express = require('express');
const { sendTestEmail } = require('../services/email');

const router = express.Router();

// Test email endpoint
router.post('/email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields: to, subject, message' 
      });
    }

    const result = await sendTestEmail(to, subject, message);
    
    if (result.success) {
      res.json({
        success: true,
        message: `Test email sent successfully to ${to}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Test email route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
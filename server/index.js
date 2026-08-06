// server/index.js – Minimal Express server for email dispatch
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health‑check endpoint
app.get('/api/ping', (req, res) => res.json({ status: 'ok' }));

// Email send endpoint
app.post('/api/send', async (req, res) => {
  const { to_email, event_title, event_date, event_venue, pass_tier, message } = req.body;

  // Create a fresh Ethereal test account (no real credentials needed)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"EventSphere" <no-reply@eventsphere.local>',
    to: to_email,
    subject: `Invitation – ${event_title}`,
    html: `<p>${message}</p><p><strong>Venue:</strong> ${event_venue}<br/><strong>Date:</strong> ${event_date}<br/><strong>Pass:</strong> ${pass_tier}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    res.json({ status: 'delivered', previewUrl });
  } catch (err) {
    console.error('Mail send error:', err);
    res.status(500).json({ status: "failed", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔔 Email server listening at http://localhost:${PORT}`));

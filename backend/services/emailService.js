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

/* ─────────────────────────────────────────────
   Welcome Email — sent on student registration
───────────────────────────────────────────── */
const sendWelcomeEmail = async (name, email, cometId) => {
  await transporter.sendMail({
    from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to IIITB COMET FWC!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d55a0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">IIITB COMET FWC</h1>
          <p style="color: #93b4e8; margin: 8px 0 0;">Future Wireless Communications Program</p>
        </div>
        <div style="padding: 32px; background: #f7f7ff;">
          <h2 style="color: #2d55a0;">Welcome, ${name}!</h2>
          <p style="color: #333;">Your registration is successful.</p>
          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0; color: #666;">Your COMET ID</p>
            <h2 style="margin: 8px 0 0; color: #2d55a0;">${cometId}</h2>
          </div>
          <p style="color: #333;">You can now login and proceed with your payment.</p>
          <a href="${process.env.FRONTEND_URL}/login"
             style="display: inline-block; background: #2d55a0; color: white;
                    padding: 12px 28px; border-radius: 8px; text-decoration: none;
                    font-weight: bold; margin-top: 16px;">
            Login Now
          </a>
        </div>
        <div style="background: #1a3a8f; padding: 16px; text-align: center;">
          <p style="color: #93b4e8; margin: 0; font-size: 12px;">
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>
    `
  });
};

/* ─────────────────────────────────────────────
   Receipt Email — sent to student on payment submission
───────────────────────────────────────────── */
const sendReceiptEmail = async ({ name, email, cometId, modules, grandTotal, utrNumber }) => {
  const modulesList = modules
    .map(m => `<li style="padding: 6px 0; color: #333;">
                 ${m.moduleName}${m.termName ? ' — ' + m.termName : ''}
               </li>`)
    .join('');

  await transporter.sendMail({
    from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Payment Received — Pending Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d55a0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">IIITB COMET FWC</h1>
          <p style="color: #93b4e8; margin: 8px 0 0;">Future Wireless Communications Program</p>
        </div>
        <div style="padding: 32px; background: #f7f7ff;">
          <h2 style="color: #2d55a0;">Payment Received, ${name}!</h2>
          <p style="color: #333;">Your payment has been submitted and is currently <strong>pending verification</strong>.</p>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">COMET ID</td>
                <td style="color: #2d55a0; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${cometId}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">UTR Number</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${utrNumber}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">Amount Paid</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">Status</td>
                <td style="color: #f59e0b; font-weight: bold; padding: 8px 0;">Pending Verification</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; font-weight: 600;">Modules Selected:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${modulesList}
          </ul>

          <p style="color: #333; margin-top: 24px;">
            You will receive another email once your payment is verified by the admin.
          </p>
        </div>
        <div style="background: #1a3a8f; padding: 16px; text-align: center;">
          <p style="color: #93b4e8; margin: 0; font-size: 12px;">
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>
    `
  });
};

/* ─────────────────────────────────────────────
   Admin Alert — sent to admin when new payment submitted
───────────────────────────────────────────── */
const sendAdminAlert = async ({ name, email, cometId, modules, grandTotal, utrNumber }) => {
  const modulesList = modules
    .map(m => `<li style="padding: 6px 0; color: #333;">
                 ${m.moduleName}${m.termName ? ' — ' + m.termName : ''}
               </li>`)
    .join('');

  await transporter.sendMail({
    from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Payment Submitted — ${cometId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a3a8f; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">Admin Alert</h1>
          <p style="color: #93b4e8; margin: 8px 0 0;">New Payment Requires Verification</p>
        </div>
        <div style="padding: 32px; background: #f7f7ff;">
          <h2 style="color: #1a3a8f;">New Payment Submitted</h2>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">Student Name</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">COMET ID</td>
                <td style="color: #2d55a0; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${cometId}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">Email</td>
                <td style="color: #333; padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">UTR Number</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${utrNumber}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">Amount</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0;">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; font-weight: 600;">Modules Selected:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${modulesList}
          </ul>

          <a href="${process.env.FRONTEND_URL}/admin"
             style="display: inline-block; background: #1a3a8f; color: white;
                    padding: 12px 28px; border-radius: 8px; text-decoration: none;
                    font-weight: bold; margin-top: 24px;">
            Go to Admin Dashboard
          </a>
        </div>
        <div style="background: #1a3a8f; padding: 16px; text-align: center;">
          <p style="color: #93b4e8; margin: 0; font-size: 12px;">
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>
    `
  });
};


/* ─────────────────────────────────────────────
   Payment Verified Email — sent to student
───────────────────────────────────────────── */
const sendPaymentVerifiedEmail = async ({ name, email, cometId, modules, grandTotal, utrNumber }) => {
  const modulesList = modules
    .map(m => `<li style="padding: 6px 0; color: #333;">
                 ${m.moduleName}${m.termName ? ' — ' + m.termName : ''}
               </li>`)
    .join('');

  await transporter.sendMail({
    from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Payment Verified ✅ — IIITB COMET FWC',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d55a0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">IIITB COMET FWC</h1>
          <p style="color: #93b4e8; margin: 8px 0 0;">Future Wireless Communications Program</p>
        </div>
        <div style="padding: 32px; background: #f7f7ff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #dcfce7; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 32px; text-align: center;">✅</div>
          </div>
          <h2 style="color: #16a34a; text-align: center;">Payment Verified!</h2>
          <p style="color: #333; text-align: center;">Dear ${name}, your payment has been successfully verified.</p>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">COMET ID</td>
                <td style="color: #2d55a0; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${cometId}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">UTR Number</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${utrNumber}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">Amount Paid</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">Status</td>
                <td style="color: #16a34a; font-weight: bold; padding: 8px 0;">✅ Verified</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; font-weight: 600;">Modules:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${modulesList}
          </ul>

          <p style="color: #333; margin-top: 24px;">
            Welcome aboard! You are now enrolled in the Future Wireless Communications Program.
          </p>
        </div>
        <div style="background: #1a3a8f; padding: 16px; text-align: center;">
          <p style="color: #93b4e8; margin: 0; font-size: 12px;">
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>
    `
  });
};

/* ─────────────────────────────────────────────
   Payment Rejected Email — sent to student
───────────────────────────────────────────── */
const sendPaymentRejectedEmail = async ({ name, email, cometId, modules, grandTotal, utrNumber }) => {
  const modulesList = modules
    .map(m => `<li style="padding: 6px 0; color: #333;">
                 ${m.moduleName}${m.termName ? ' — ' + m.termName : ''}
               </li>`)
    .join('');

  await transporter.sendMail({
    from: `"IIITB COMET FWC" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Payment Rejected ❌ — IIITB COMET FWC',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2d55a0; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0;">IIITB COMET FWC</h1>
          <p style="color: #93b4e8; margin: 8px 0 0;">Future Wireless Communications Program</p>
        </div>
        <div style="padding: 32px; background: #f7f7ff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #fee2e2; border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 32px; text-align: center;">❌</div>
          </div>
          <h2 style="color: #dc2626; text-align: center;">Payment Rejected</h2>
          <p style="color: #333; text-align: center;">Dear ${name}, unfortunately your payment could not be verified.</p>

          <div style="background: white; border-radius: 10px; padding: 20px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">COMET ID</td>
                <td style="color: #2d55a0; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${cometId}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">UTR Number</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">${utrNumber}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0; border-bottom: 1px solid #eee;">Amount</td>
                <td style="color: #333; font-weight: bold; padding: 8px 0; border-bottom: 1px solid #eee;">₹${grandTotal.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="color: #666; padding: 8px 0;">Status</td>
                <td style="color: #dc2626; font-weight: bold; padding: 8px 0;">❌ Rejected</td>
              </tr>
            </table>
          </div>

          <p style="color: #555; font-weight: 600;">Modules:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${modulesList}
          </ul>

          <div style="background: #fee2e2; border-radius: 10px; padding: 16px; margin-top: 24px;">
            <p style="color: #dc2626; margin: 0; font-weight: 600;">What to do next?</p>
            <p style="color: #333; margin: 8px 0 0;">
              Please contact us at 
              <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #2d55a0;">${process.env.ADMIN_EMAIL}</a> 
              with your UTR number for assistance.
            </p>
          </div>
        </div>
        <div style="background: #1a3a8f; padding: 16px; text-align: center;">
          <p style="color: #93b4e8; margin: 0; font-size: 12px;">
            © 2025 IIITB COMET Foundation. All Rights Reserved.
          </p>
        </div>
      </div>
    `
  });
};



module.exports = { 
  sendWelcomeEmail, 
  sendReceiptEmail, 
  sendAdminAlert,
  sendPaymentVerifiedEmail,
  sendPaymentRejectedEmail
};
const jwt      = require('jsonwebtoken');
const Student  = require('../models/Student');
const { sendWelcomeEmail } = require('../services/emailService');
const signTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
  return { accessToken, refreshToken };
};

/* ─────────────────────────────────────────────
   Student Register
───────────────────────────────────────────── */
const register = async (req, res) => {
  try {
    const { name, cometId, email, contact, password } = req.body;

    const existing = await Student.findOne({ $or: [{ cometId: cometId.toUpperCase() }, { email }] });
    if (existing) {
      const field = existing.cometId === cometId.toUpperCase() ? 'COMET ID' : 'Email';
      return res.status(409).json({ message: `${field} is already registered.` });
    }

    const student = await Student.create({
      name,
      cometId: cometId.toUpperCase(),
      email,
      contact,
      passwordHash: password
    });
    // 👇 add this block right here
    //try {
      //  await sendWelcomeEmail(student.name, student.email, student.cometId);
        //  } catch (mailErr) {
          //  console.error('Welcome email failed:', mailErr);
              // we don't block registration if email fails
            //  }

    // Fire and forget — don't block registration
sendWelcomeEmail(student.name, student.email, student.cometId)
  .catch(err => console.log('Welcome email failed:', err.message));

    const payload = { id: student._id, cometId: student.cometId, role: student.role };
    const { accessToken, refreshToken } = signTokens(payload);

    res.status(201).json({
      message: 'Registration successful',
      accessToken,
      refreshToken,
      user: { name: student.name, cometId: student.cometId, email: student.email, contact: student.contact, role: student.role }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

/* ─────────────────────────────────────────────
   Admin Register
   POST /api/auth/admin-register
   Body: { name, adminId, email, contact, password, accessCode }
───────────────────────────────────────────── */
const adminRegister = async (req, res) => {
  try {
    const { name, adminId, email, contact, password, accessCode } = req.body;

    // 1. Verify the admin access code
    if (!accessCode || accessCode !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid Admin Access Code.' });
    }

    // 2. Check for duplicates (cometId field reused as adminId for consistency)
    const existing = await Student.findOne({
      $or: [{ cometId: adminId.toUpperCase() }, { email }]
    });
    if (existing) {
      const field = existing.cometId === adminId.toUpperCase() ? 'Admin ID' : 'Email';
      return res.status(409).json({ message: `${field} is already registered.` });
    }

    // 3. Create admin — same Student model, role set to 'admin'
    const admin = await Student.create({
      name,
      cometId:      adminId.toUpperCase(),   // reuse cometId field as the unique identifier
      email,
      contact,
      passwordHash: password,
      role:         'admin',
    });

    // 4. Return tokens (same shape as student register — Login.jsx will work as-is)
    const payload = { id: admin._id, cometId: admin.cometId, role: admin.role };
    const { accessToken, refreshToken } = signTokens(payload);

    res.status(201).json({
      message: 'Admin account created successfully.',
      accessToken,
      refreshToken,
      user: { name: admin.name, cometId: admin.cometId, email: admin.email, role: admin.role }
    });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ message: 'Admin registration failed. Please try again.' });
  }
};

/* ─────────────────────────────────────────────
   Login  (student + admin, same endpoint)
───────────────────────────────────────────── */
const login = async (req, res) => {
  try {
    const { cometId, password, adminCode } = req.body;

    // Find user first (needed to know role before any check)
    const student = await Student.findOne({ cometId: cometId.toUpperCase() });

    if (!student) {
      return res.status(401).json({ message: 'Invalid COMET ID or password.' });
    }

    // Verify password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid COMET ID or password.' });
    }

    // Admin extra verification — only checked if role is admin
    if (student.role === 'admin') {
      if (!adminCode || adminCode !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin access code.' });
      }
    }

    const payload = { id: student._id, cometId: student.cometId, role: student.role };
    const { accessToken, refreshToken } = signTokens(payload);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { name: student.name, cometId: student.cometId, email: student.email, contact: student.contact, role: student.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

/* ─────────────────────────────────────────────
   Refresh Token
───────────────────────────────────────────── */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required.' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(401).json({ message: 'User not found.' });

    const payload = { id: student._id, cometId: student.cometId, role: student.role };
    const { accessToken, refreshToken: newRefresh } = signTokens(payload);

    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
};

/* ─────────────────────────────────────────────
   Get Me
───────────────────────────────────────────── */
const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-passwordHash');
    if (!student) return res.status(404).json({ message: 'User not found.' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

module.exports = { register, adminRegister, login, refreshToken, getMe };

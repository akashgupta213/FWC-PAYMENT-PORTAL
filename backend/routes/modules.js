const express = require('express');
const router  = express.Router();
const { getModules, upsertModule } = require('../controllers/moduleController');
const { verifyJWT, verifyAdmin }   = require('../middleware/auth');

router.get('/',   verifyJWT, getModules);
router.post('/',  verifyJWT, verifyAdmin, upsertModule);

module.exports = router;
const express = require('express');
const router  = express.Router();
const { getAssets, upsertAsset } = require('../controllers/assetController');
const { verifyJWT, verifyAdmin } = require('../middleware/auth');
// PUBLIC ROUTE
router.get('/', getAssets);

//ADMIN ONLY ROUTE
router.get('/',  verifyJWT, getAssets);
router.post('/', verifyJWT, verifyAdmin, upsertAsset);

module.exports = router;
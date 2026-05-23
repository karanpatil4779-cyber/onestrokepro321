const express = require('express');
const router = express.Router();
const { uploadDocument, getProviderProfile, searchProviders, getPendingProviders, verifyProvider } = require('../controllers/providerController');
const upload = require('../middleware/upload');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/upload-doc', auth, upload.single('document'), uploadDocument);
router.get('/search', auth, searchProviders);
router.get('/pending', auth, adminAuth, getPendingProviders);
router.put('/:id/verify', auth, adminAuth, verifyProvider);
router.get('/profile/:id', auth, getProviderProfile);

module.exports = router;

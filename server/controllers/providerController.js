const mongoose = require('mongoose');
const Provider = require('../models/Provider');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.uploadDocument = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ msg: 'MongoDB unavailable. Cannot upload documents at this time.' });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const { providerId, docType } = req.body;
    const provider = await Provider.findById(providerId);

    if (!provider) return res.status(404).json({ msg: 'Provider not found' });

    provider.documents.push({
      docType,
      fileUrl: req.file.path,
      verified: false
    });

    await provider.save();
    res.json({ msg: 'Document uploaded successfully', fileUrl: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getProviderProfile = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ msg: 'MongoDB unavailable. Cannot fetch profile right now.' });
  }

  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ msg: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.searchProviders = async (req, res) => {
  if (!isDbConnected()) {
    return res.json([]);
  }

  try {
    const { service, city, gender, minRating } = req.query;
    
    let query = { 
      verificationStatus: 'approved',
      isAvailableNow: true
    };

    if (service) {
      query['services.type'] = service.toLowerCase();
    }
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (gender) {
      query.gender = gender;
    }
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    const providers = await Provider.find(query).select('-documents -bankDetails');
    res.json(providers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getPendingProviders = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ msg: 'MongoDB unavailable. Cannot fetch pending providers.' });
  }

  try {
    const providers = await Provider.find({ verificationStatus: 'pending' });
    res.json(providers);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.verifyProvider = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ msg: 'MongoDB unavailable. Cannot update provider status.' });
  }

  try {
    const { status, rejectionReason } = req.body;
    const provider = await Provider.findById(req.params.id);

    if (!provider) return res.status(404).json({ msg: 'Provider not found' });

    provider.verificationStatus = status;
    if (rejectionReason) provider.rejectionReason = rejectionReason;
    
    if (status === 'approved') {
      provider.documents.forEach(doc => doc.verified = true);
    }

    await provider.save();
    res.json({ msg: `Provider ${status}`, provider });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

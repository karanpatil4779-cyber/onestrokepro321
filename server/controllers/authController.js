const mongoose = require('mongoose');
const User = require('../models/User');
const Provider = require('../models/Provider');
const jwt = require('jsonwebtoken');
const { verifyFirebaseToken, isConfigured } = require('../config/firebase');

const fallbackUsers = [];
const fallbackProviders = [];

const getPhoneFromRequest = async (req) => {
  if (req.body.idToken && isConfigured) {
    const decoded = await verifyFirebaseToken(req.body.idToken);
    if (decoded && decoded.phone_number) {
      return decoded.phone_number;
    }
  }
  return req.body.phone;
};

const isDbConnected = () => mongoose.connection.readyState === 1;

const findUserByPhone = async (phone) => {
  if (isDbConnected()) {
    return User.findOne({ phone });
  }
  return fallbackUsers.find((u) => u.phone === phone) || null;
};

const findProviderByPhone = async (phone) => {
  if (isDbConnected()) {
    return Provider.findOne({ phone });
  }
  return fallbackProviders.find((p) => p.phone === phone) || null;
};

const createFallbackUser = ({ fullName, email, phone, gender, city, town }) => {
  const user = {
    _id: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    fullName,
    email,
    phone,
    gender,
    city,
    town,
    role: 'customer',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  fallbackUsers.push(user);
  return user;
};

const createFallbackProvider = (providerData) => {
  const provider = {
    _id: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    ...providerData,
    role: 'provider',
    verificationStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  fallbackProviders.push(provider);
  return provider;
};

const signTokenAndSend = (res, entity) => {
  const payload = { user: { id: entity.id || entity._id, role: entity.role } };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
    if (err) throw err;
    res.json({ token, user: entity });
  });
};

exports.registerCustomer = async (req, res) => {
  try {
    const phone = await getPhoneFromRequest(req);
    if (!phone) return res.status(400).json({ msg: 'Phone number is required' });

    const { fullName, email, gender, city, town } = req.body;
    const existingUser = await findUserByPhone(phone);
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    if (isDbConnected()) {
      const user = new User({ fullName, email, phone, gender, city, town });
      await user.save();
      return signTokenAndSend(res, user);
    }

    const user = createFallbackUser({ fullName, email, phone, gender, city, town });
    return signTokenAndSend(res, user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.registerProvider = async (req, res) => {
  try {
    const phone = await getPhoneFromRequest(req);
    if (!phone) return res.status(400).json({ msg: 'Phone number is required' });

    const providerData = { ...req.body, phone };
    delete providerData.idToken;
    delete providerData.documents;

    const existingProvider = await findProviderByPhone(phone);
    if (existingProvider) return res.status(400).json({ msg: 'Provider already exists' });

    if (isDbConnected()) {
      const provider = new Provider(providerData);
      await provider.save();
      return signTokenAndSend(res, provider);
    }

    const provider = createFallbackProvider(providerData);
    return signTokenAndSend(res, provider);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    let entity;
    if (role === 'provider') {
      const Provider = require('../models/Provider');
      entity = isDbConnected() ? await Provider.findById(id) : fallbackProviders.find(p => (p._id === id || p.id === id));
    } else {
      entity = isDbConnected() ? await User.findById(id) : fallbackUsers.find(u => (u._id === id || u.id === id));
    }
    if (!entity) return res.status(404).json({ msg: 'User not found' });
    res.json({ user: entity });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const phone = await getPhoneFromRequest(req);
    if (!phone) return res.status(400).json({ msg: 'Phone number is required' });

    let user = await findUserByPhone(phone);
    if (!user) {
      user = await findProviderByPhone(phone);
    }

    if (!user) return res.status(404).json({ msg: 'User not found' });

    return signTokenAndSend(res, user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const USERS_KEY = 'onestroke_users';
const SESSION_KEY = 'onestroke_current_user';
const BOOKINGS_KEY = 'onestroke_bookings';

export const demoProviders = [
  {
    _id: 'provider-driver-1',
    fullName: 'Ramesh Patil',
    phone: '+919876543210',
    email: 'ramesh@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Maharashtra', city: 'Mumbai', town: 'Andheri', pincode: '400053' },
    services: [{ type: 'driver', rate: 650, rateType: 'day' }],
    languages: ['Hindi', 'Marathi', 'English'],
    rating: { average: 4.8 },
    createdAt: '2026-01-15T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX1234', ifsc: 'HDFC0001234', upiId: 'ramesh@upi' },
  },
  {
    _id: 'provider-cook-1',
    fullName: 'Sunita Sharma',
    phone: '+919812345670',
    email: 'sunita@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Maharashtra', city: 'Pune', town: 'Kothrud', pincode: '411038' },
    services: [{ type: 'cook', rate: 450, rateType: 'visit' }, { type: 'maid', rate: 350, rateType: 'visit' }],
    languages: ['Hindi', 'Marathi'],
    rating: { average: 4.7 },
    createdAt: '2026-02-02T10:00:00.000Z',
    documents: [{ docType: 'pan', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX5678', ifsc: 'SBIN0005678', upiId: 'sunita@upi' },
  },
  {
    _id: 'provider-tutor-1',
    fullName: 'Amit Deshmukh',
    phone: '+917777777777',
    email: 'amit@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Maharashtra', city: 'Mumbai', town: 'Dadar', pincode: '400014' },
    services: [{ type: 'tutor', rate: 800, rateType: 'hour' }, { type: 'care', rate: 500, rateType: 'hour' }],
    languages: ['English', 'Hindi'],
    rating: { average: 4.9 },
    createdAt: '2026-03-08T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX9012', ifsc: 'ICIC0009012', upiId: 'amit@upi' },
  },
  {
    _id: 'provider-handyman-1',
    fullName: 'Imran Shaikh',
    phone: '+918888888888',
    email: 'imran@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Maharashtra', city: 'Nashik', town: 'College Road', pincode: '422005' },
    services: [{ type: 'handyman', rate: 550, rateType: 'visit' }, { type: 'errand', rate: 250, rateType: 'task' }, { type: 'queue', rate: 300, rateType: 'task' }],
    languages: ['Hindi', 'Marathi'],
    rating: { average: 4.5 },
    createdAt: '2026-04-10T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX3456', ifsc: 'AXIS0003456', upiId: 'imran@upi' },
  },
];

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCurrentUser = () => readJson(SESSION_KEY, null);

export const setCurrentUser = (user) => {
  if (user) {
    writeJson(SESSION_KEY, user);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const getUsers = () => readJson(USERS_KEY, []);

export const saveUser = (user) => {
  const users = getUsers();
  const nextUsers = users.some((item) => item._id === user._id)
    ? users.map((item) => (item._id === user._id ? user : item))
    : [...users, user];
  writeJson(USERS_KEY, nextUsers);
  setCurrentUser(user);
  return user;
};

export const findUserByPhone = (phone) => getUsers().find((user) => user.phone === phone);

export const createCustomer = ({ phone, fullName, email, gender, city, town }) => saveUser({
  _id: `customer_${Date.now()}`,
  role: 'customer',
  phone,
  fullName,
  email,
  gender,
  city,
  town,
  wallet: { balance: 0 },
});

export const createProvider = ({ phone, formData }) => saveUser({
  _id: `provider_${Date.now()}`,
  role: 'provider',
  phone,
  fullName: formData.fullName,
  email: formData.email,
  gender: formData.gender,
  dob: formData.dob,
  location: formData.location,
  services: formData.services.map((service) => ({ type: service, rate: 500, rateType: 'visit' })),
  documents: formData.documents.map((doc) => ({ docType: doc.docType, fileUrl: doc.dataUrl })),
  bankDetails: formData.bankDetails,
  languages: ['Hindi'],
  rating: { average: 0 },
  verificationStatus: 'approved',
  createdAt: new Date().toISOString(),
  isAvailableNow: true,
});

export const getAllProviders = () => [
  ...demoProviders,
  ...getUsers().filter((user) => user.role === 'provider'),
];

export const searchProviders = ({ serviceType, city, gender, minRating }) => getAllProviders().filter((provider) => {
  const matchesService = !serviceType || provider.services?.some((service) => service.type === serviceType);
  const matchesCity = !city || provider.location?.city?.toLowerCase().includes(city.toLowerCase());
  const matchesGender = !gender || provider.gender === gender;
  const matchesRating = !minRating || (provider.rating?.average || 0) >= Number(minRating);
  return matchesService && matchesCity && matchesGender && matchesRating;
});

export const saveBooking = (booking) => {
  const bookings = readJson(BOOKINGS_KEY, []);
  const nextBooking = { _id: `booking_${Date.now()}`, createdAt: new Date().toISOString(), ...booking };
  writeJson(BOOKINGS_KEY, [nextBooking, ...bookings]);
  return nextBooking;
};

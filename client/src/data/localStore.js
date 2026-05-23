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
  {
    _id: 'provider-driver-2',
    fullName: 'Harpreet Singh',
    phone: '+919999000101',
    email: 'harpreet@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Delhi', city: 'Delhi', town: 'Dwarka', pincode: '110075' },
    services: [{ type: 'driver', rate: 750, rateType: 'day' }, { type: 'errand', rate: 300, rateType: 'task' }],
    languages: ['Hindi', 'Punjabi', 'English'],
    rating: { average: 4.6 },
    createdAt: '2026-02-19T10:00:00.000Z',
    documents: [{ docType: 'driving_license', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX1188', ifsc: 'PUNB0001188', upiId: 'harpreet@upi' },
  },
  {
    _id: 'provider-maid-2',
    fullName: 'Lakshmi Nair',
    phone: '+919999000102',
    email: 'lakshmi@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Karnataka', city: 'Bengaluru', town: 'Indiranagar', pincode: '560038' },
    services: [{ type: 'maid', rate: 400, rateType: 'visit' }, { type: 'care', rate: 550, rateType: 'hour' }],
    languages: ['Kannada', 'Hindi', 'English'],
    rating: { average: 4.9 },
    createdAt: '2026-03-02T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX2288', ifsc: 'KKBK0002288', upiId: 'lakshmi@upi' },
  },
  {
    _id: 'provider-cook-2',
    fullName: 'Meenakshi Iyer',
    phone: '+919999000103',
    email: 'meenakshi@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Tamil Nadu', city: 'Chennai', town: 'T Nagar', pincode: '600017' },
    services: [{ type: 'cook', rate: 500, rateType: 'visit' }],
    languages: ['Tamil', 'English', 'Hindi'],
    rating: { average: 4.8 },
    createdAt: '2026-03-11T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX3388', ifsc: 'IDIB0003388', upiId: 'meenakshi@upi' },
  },
  {
    _id: 'provider-tutor-2',
    fullName: 'Priyanka Gupta',
    phone: '+919999000104',
    email: 'priyanka@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    location: { state: 'West Bengal', city: 'Kolkata', town: 'Salt Lake', pincode: '700091' },
    services: [{ type: 'tutor', rate: 700, rateType: 'hour' }],
    languages: ['Bengali', 'Hindi', 'English'],
    rating: { average: 4.7 },
    createdAt: '2026-01-25T10:00:00.000Z',
    documents: [{ docType: 'degree_certificate', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX4488', ifsc: 'UTIB0004488', upiId: 'priyanka@upi' },
  },
  {
    _id: 'provider-care-2',
    fullName: 'Anjali Menon',
    phone: '+919999000105',
    email: 'anjali@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Kerala', city: 'Kochi', town: 'Edappally', pincode: '682024' },
    services: [{ type: 'care', rate: 650, rateType: 'hour' }],
    languages: ['Malayalam', 'English', 'Hindi'],
    rating: { average: 4.9 },
    createdAt: '2026-04-01T10:00:00.000Z',
    documents: [{ docType: 'nursing_certificate', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX5588', ifsc: 'FDRL0005588', upiId: 'anjali@upi' },
  },
  {
    _id: 'provider-handyman-2',
    fullName: 'Suresh Yadav',
    phone: '+919999000106',
    email: 'suresh@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Uttar Pradesh', city: 'Lucknow', town: 'Gomti Nagar', pincode: '226010' },
    services: [{ type: 'handyman', rate: 500, rateType: 'visit' }],
    languages: ['Hindi'],
    rating: { average: 4.4 },
    createdAt: '2026-04-08T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX6688', ifsc: 'BARB0006688', upiId: 'suresh@upi' },
  },
  {
    _id: 'provider-queue-2',
    fullName: 'Nikhil Reddy',
    phone: '+919999000107',
    email: 'nikhil@example.com',
    role: 'provider',
    gender: 'Male',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Telangana', city: 'Hyderabad', town: 'Madhapur', pincode: '500081' },
    services: [{ type: 'queue', rate: 350, rateType: 'task' }, { type: 'errand', rate: 300, rateType: 'task' }],
    languages: ['Telugu', 'Hindi', 'English'],
    rating: { average: 4.6 },
    createdAt: '2026-02-28T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX7788', ifsc: 'HDFC0007788', upiId: 'nikhil@upi' },
  },
  {
    _id: 'provider-maid-3',
    fullName: 'Pooja Chavan',
    phone: '+919999000108',
    email: 'pooja@example.com',
    role: 'provider',
    gender: 'Female',
    verificationStatus: 'approved',
    profilePhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=240&q=80',
    location: { state: 'Maharashtra', city: 'Nagpur', town: 'Dharampeth', pincode: '440010' },
    services: [{ type: 'maid', rate: 320, rateType: 'visit' }, { type: 'cook', rate: 420, rateType: 'visit' }],
    languages: ['Marathi', 'Hindi'],
    rating: { average: 4.5 },
    createdAt: '2026-01-18T10:00:00.000Z',
    documents: [{ docType: 'aadhaar', fileUrl: '#' }],
    bankDetails: { accountNo: 'XXXX8888', ifsc: 'MAHB0008888', upiId: 'pooja@upi' },
  },
];

export const demoCustomers = [
  {
    _id: 'customer-demo-1',
    role: 'customer',
    phone: '+919000000001',
    fullName: 'Karan Patil',
    email: 'karan@example.com',
    gender: 'Male',
    city: 'Mumbai',
    town: 'Borivali',
    wallet: { balance: 1250 },
  },
  {
    _id: 'customer-demo-2',
    role: 'customer',
    phone: '+919000000002',
    fullName: 'Aditi Sharma',
    email: 'aditi@example.com',
    gender: 'Female',
    city: 'Pune',
    town: 'Baner',
    wallet: { balance: 800 },
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

export const findUserByPhone = (phone, role) => [
  ...demoCustomers,
  ...demoProviders,
  ...getUsers(),
].find((user) => user.phone === phone && (!role || user.role === role));

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

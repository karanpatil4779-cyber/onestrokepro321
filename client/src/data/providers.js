export const SERVICE_CATEGORIES = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'cleaner',
  'pest control',
  'AC repair',
  'appliance repair',
  'geyser repair',
  'RO service',
  'sofa cleaning',
  'deep cleaning',
];

export const SERVICE_ICONS = {
  plumber: 'Wrench',
  electrician: 'Zap',
  carpenter: 'Hammer',
  painter: 'Paintbrush',
  cleaner: 'Sparkles',
  'pest control': 'Shield',
  'AC repair': 'Wind',
  'appliance repair': 'Plug',
  'geyser repair': 'Flame',
  'RO service': 'Droplets',
  'sofa cleaning': 'Armchair',
  'deep cleaning': 'Home',
};

export const CITIES = [
  { name: 'Mumbai', localities: ['Bandra', 'Andheri', 'Juhu', 'Kurla', 'Dadar', 'Borivali', 'Thane', 'Navi Mumbai'], language: 'Marathi' },
  { name: 'Delhi', localities: ['Connaught Place', 'Lajpat Nagar', 'Dwarka', 'Rohini', 'Karol Bagh', 'Saket', 'Noida ext.'], language: 'Punjabi' },
  { name: 'Bengaluru', localities: ['Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Hebbal'], language: 'Kannada' },
  { name: 'Hyderabad', localities: ['Banjara Hills', 'Madhapur', 'Gachibowli', 'Secunderabad', 'Kukatpally'], language: 'Telugu' },
  { name: 'Chennai', localities: ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'Porur'], language: 'Tamil' },
  { name: 'Pune', localities: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Baner', 'Hadapsar'], language: 'Marathi' },
  { name: 'Ahmedabad', localities: ['Navrangpura', 'Bodakdev', 'Satellite', 'CG Road', 'Vastrapur'], language: 'Gujarati' },
  { name: 'Kolkata', localities: ['Salt Lake', 'Howrah', 'Park Street', 'Dum Dum', 'New Town'], language: 'Bengali' },
  { name: 'Jaipur', localities: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme'], language: 'Rajasthani' },
  { name: 'Lucknow', localities: ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar'], language: 'Hindi' },
  { name: 'Surat', localities: ['Adajan', 'Vesu', 'Varachha', 'City Light', 'Athwa'], language: 'Gujarati' },
  { name: 'Nagpur', localities: ['Dharampeth', 'Manish Nagar', 'Sitabuldi', 'Hingna', 'Mahal'], language: 'Marathi' },
  { name: 'Coimbatore', localities: ['RS Puram', 'Peelamedu', 'Saibaba Colony', 'Gandhipuram', 'Singanallur'], language: 'Tamil' },
  { name: 'Kochi', localities: ['Edappally', 'Kakkanad', 'Panampilly Nagar', 'Fort Kochi', 'Vyttila'], language: 'Malayalam' },
  { name: 'Chandigarh', localities: ['Sector 17', 'Sector 22', 'Manimajra', 'Mohali', 'Zirakpur'], language: 'Punjabi' },
  { name: 'Bhopal', localities: ['Arera Colony', 'MP Nagar', 'Kolar Road', 'New Market', 'Bairagarh'], language: 'Hindi' },
  { name: 'Indore', localities: ['Vijay Nagar', 'Palasia', 'Rau', 'Rajwada', 'Bhawarkua'], language: 'Hindi' },
  { name: 'Patna', localities: ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Patliputra', 'Rajendra Nagar'], language: 'Bhojpuri' },
  { name: 'Vadodara', localities: ['Alkapuri', 'Gotri', 'Fatehgunj', 'Manjalpur', 'Akota'], language: 'Gujarati' },
  { name: 'Visakhapatnam', localities: ['MVP Colony', 'Gajuwaka', 'Dwaraka Nagar', 'Madhurawada', 'Seethammadhara'], language: 'Telugu' },
];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Rohan', 'Rahul', 'Suresh', 'Ramesh', 'Mahesh', 'Kiran', 'Nikhil', 'Manoj', 'Amit', 'Vijay', 'Deepak', 'Imran', 'Sameer', 'Prakash', 'Santosh', 'Ravi', 'Pooja', 'Neha', 'Sunita', 'Anita', 'Kavita', 'Meena', 'Lakshmi', 'Priya', 'Asha', 'Rekha'];
const lastNames = ['Sharma', 'Kumar', 'Patel', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Mehta', 'Yadav', 'Shaikh', 'Verma', 'Joshi', 'Deshmukh', 'Chavan', 'Das', 'Banerjee', 'Pillai', 'Mishra', 'Bose', 'Kulkarni', 'Jain', 'Malhotra', 'Rao', 'Naidu'];

const basePrice = {
  plumber: 420,
  electrician: 430,
  carpenter: 500,
  painter: 480,
  cleaner: 300,
  'pest control': 620,
  'AC repair': 650,
  'appliance repair': 560,
  'geyser repair': 520,
  'RO service': 450,
  'sofa cleaning': 380,
  'deep cleaning': 540,
};

const providerFor = (cityConfig, cityIndex, providerIndex) => {
  const primary = SERVICE_CATEGORIES[(cityIndex + providerIndex) % SERVICE_CATEGORIES.length];
  const second = SERVICE_CATEGORIES[(cityIndex + providerIndex + 4) % SERVICE_CATEGORIES.length];
  const third = SERVICE_CATEGORIES[(cityIndex + providerIndex + 8) % SERVICE_CATEGORIES.length];
  const services = providerIndex % 3 === 0 ? [primary, second, third] : providerIndex % 2 === 0 ? [primary, second] : [primary];
  const price = Math.min(800, Math.max(200, basePrice[primary] + ((providerIndex % 5) - 2) * 35));
  const phoneTail = String(6000000000 + cityIndex * 100000 + providerIndex * 137).slice(0, 10);

  return {
    id: `osp-${cityConfig.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(providerIndex + 1).padStart(2, '0')}`,
    providerName: `${firstNames[(cityIndex * 7 + providerIndex) % firstNames.length]} ${lastNames[(cityIndex * 5 + providerIndex * 3) % lastNames.length]}`,
    city: cityConfig.name,
    locality: cityConfig.localities[providerIndex % cityConfig.localities.length],
    services,
    rating: Number((4.1 + ((cityIndex * 3 + providerIndex) % 9) / 10).toFixed(1)),
    reviewCount: 50 + ((cityIndex * 97 + providerIndex * 37) % 751),
    experience: 2 + ((cityIndex * 2 + providerIndex) % 17),
    pricePerHour: price,
    available: (cityIndex + providerIndex) % 4 !== 0,
    languages: Array.from(new Set(['Hindi', cityConfig.language])),
    completedJobs: 100 + ((cityIndex * 173 + providerIndex * 89) % 1901),
    phone: phoneTail,
  };
};

export const PROVIDERS = CITIES.flatMap((cityConfig, cityIndex) =>
  Array.from({ length: 22 }, (_, providerIndex) => providerFor(cityConfig, cityIndex, providerIndex))
);

export const getProviderById = (id) => PROVIDERS.find((provider) => provider.id === id);

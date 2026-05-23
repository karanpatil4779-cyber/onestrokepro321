require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const localOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5176'
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: localOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/payments', require('./routes/payments'));

// Database Connection — auto-fallback to in-memory MongoDB if not available
mongoose.set('bufferCommands', false);
async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/onestroke';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 10000 });
    console.log('MongoDB Connected to:', uri);
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.warn('Starting in-memory MongoDB (mongodb-memory-server)...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 10000 });
      console.log('In-memory MongoDB Connected:', memUri);
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
}

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_user_room', (userId) => {
    socket.join(userId);
    console.log(`User/Provider joined private room: ${userId}`);
  });

  socket.on('new_booking_request', (data) => {
    io.to(data.providerId).emit('incoming_booking', {
      message: `New booking request from ${data.customerName}`,
      booking: data.bookingDetails
    });
  });

  socket.on('booking_response', (data) => {
    io.to(data.customerId).emit('booking_status_update', {
      message: `Provider ${data.providerName} has ${data.status} your request`,
      status: data.status
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'ONESTROKE Server is running' });
});

async function autoSeed() {
  const Provider = require('./models/Provider');
  const count = await Provider.countDocuments();
  if (count > 0) { console.log(`DB already has ${count} providers, skipping seed`); return; }

  const providers = [
    { fullName:'Ravi Desai', email:'ravi@example.com', phone:'+919876543216', gender:'Male', location:{ state:'Gujarat', city:'Surat', town:'Adajan', pincode:'395009', serviceRadiusKm:10 }, services:[{ type:'driver', rateType:'hourly', rate:180 }], languages:['Gujarati','Hindi'], verificationStatus:'pending', isAvailableNow:false, documents:[{ docType:'aadhar_card', fileUrl:'/uploads/sample-aadhar.pdf', verified:false }], bankDetails:{ accountNo:'12345678901', ifsc:'SBIN0001234', upiId:'ravi@upi' } },
    { fullName:'Meera Joshi', email:'meera@example.com', phone:'+919876543217', gender:'Female', location:{ state:'Rajasthan', city:'Jaipur', town:'Vaishali Nagar', pincode:'302021', serviceRadiusKm:8 }, services:[{ type:'maid', rateType:'daily', rate:500 }], languages:['Hindi','Rajasthani'], verificationStatus:'pending', isAvailableNow:false, documents:[{ docType:'pan_card', fileUrl:'/uploads/sample-pan.pdf', verified:false }], bankDetails:{ accountNo:'98765432109', ifsc:'HDFC0005678', upiId:'meera@paytm' } },
    { fullName:'Rajesh Kumar', email:'rajesh@example.com', phone:'+919876543201', gender:'Male', location:{ state:'Maharashtra', city:'Mumbai', town:'Andheri West', pincode:'400053', serviceRadiusKm:15 }, services:[{ type:'driver', rateType:'hourly', rate:200 },{ type:'handyman', rateType:'hourly', rate:350 }], languages:['Hindi','English','Marathi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.5, count:28 }, totalEarnings:18500 },
    { fullName:'Priya Sharma', email:'priya@example.com', phone:'+919876543202', gender:'Female', location:{ state:'Maharashtra', city:'Mumbai', town:'Powai', pincode:'400076', serviceRadiusKm:10 }, services:[{ type:'maid', rateType:'daily', rate:600 },{ type:'cook', rateType:'daily', rate:500 }], languages:['Hindi','English','Marathi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.8, count:42 }, totalEarnings:32000 },
    { fullName:'Amit Singh', email:'amit@example.com', phone:'+919876543203', gender:'Male', location:{ state:'Delhi', city:'Delhi', town:'Dwarka', pincode:'110075', serviceRadiusKm:12 }, services:[{ type:'driver', rateType:'hourly', rate:180 },{ type:'errand', rateType:'fixed', rate:300 }], languages:['Hindi','English','Punjabi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.2, count:15 }, totalEarnings:12000 },
    { fullName:'Sunita Devi', email:'sunita@example.com', phone:'+919876543204', gender:'Female', location:{ state:'Uttar Pradesh', city:'Lucknow', town:'Gomti Nagar', pincode:'226010', serviceRadiusKm:8 }, services:[{ type:'maid', rateType:'daily', rate:400 },{ type:'care', rateType:'hourly', rate:250 }], languages:['Hindi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.6, count:33 }, totalEarnings:22000 },
    { fullName:'Vikram Patel', email:'vikram@example.com', phone:'+919876543205', gender:'Male', location:{ state:'Gujarat', city:'Ahmedabad', town:'Satellite', pincode:'380015', serviceRadiusKm:10 }, services:[{ type:'cook', rateType:'daily', rate:450 },{ type:'driver', rateType:'hourly', rate:170 }], languages:['Hindi','Gujarati','English'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.3, count:20 }, totalEarnings:15000 },
    { fullName:'Ananya Reddy', email:'ananya@example.com', phone:'+919876543206', gender:'Female', location:{ state:'Karnataka', city:'Bengaluru', town:'Indiranagar', pincode:'560038', serviceRadiusKm:12 }, services:[{ type:'tutor', rateType:'hourly', rate:500 },{ type:'care', rateType:'hourly', rate:300 }], languages:['English','Hindi','Telugu','Kannada'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.9, count:55 }, totalEarnings:45000 },
    { fullName:'Mohammad Ali', email:'ali@example.com', phone:'+919876543207', gender:'Male', location:{ state:'Telangana', city:'Hyderabad', town:'Banjara Hills', pincode:'500034', serviceRadiusKm:15 }, services:[{ type:'driver', rateType:'hourly', rate:190 },{ type:'queue', rateType:'fixed', rate:250 }], languages:['Hindi','Urdu','Telugu','English'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.4, count:18 }, totalEarnings:13000 },
    { fullName:'Lakshmi Nair', email:'lakshmi@example.com', phone:'+919876543208', gender:'Female', location:{ state:'Kerala', city:'Kochi', town:'Marine Drive', pincode:'682031', serviceRadiusKm:8 }, services:[{ type:'cook', rateType:'daily', rate:550 },{ type:'maid', rateType:'daily', rate:450 }], languages:['Malayalam','English','Hindi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.7, count:38 }, totalEarnings:28000 },
    { fullName:'Rohit Joshi', email:'rohit@example.com', phone:'+919876543209', gender:'Male', location:{ state:'Uttarakhand', city:'Dehradun', town:'Rajpur Road', pincode:'248001', serviceRadiusKm:10 }, services:[{ type:'handyman', rateType:'hourly', rate:300 },{ type:'driver', rateType:'hourly', rate:160 }], languages:['Hindi','English','Punjabi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.1, count:12 }, totalEarnings:9500 },
    { fullName:'Kavita Deshmukh', email:'kavita@example.com', phone:'+919876543210', gender:'Female', location:{ state:'Maharashtra', city:'Pune', town:'Koregaon Park', pincode:'411001', serviceRadiusKm:12 }, services:[{ type:'tutor', rateType:'hourly', rate:600 },{ type:'care', rateType:'hourly', rate:350 }], languages:['Marathi','Hindi','English','Sanskrit'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.8, count:47 }, totalEarnings:38000 },
    { fullName:'Arjun Mehta', email:'arjun@example.com', phone:'+919876543211', gender:'Male', location:{ state:'Rajasthan', city:'Jaipur', town:'Malviya Nagar', pincode:'302017', serviceRadiusKm:10 }, services:[{ type:'driver', rateType:'hourly', rate:150 },{ type:'errand', rateType:'fixed', rate:200 }], languages:['Hindi','English','Rajasthani'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.0, count:9 }, totalEarnings:7500 },
    { fullName:'Neha Gupta', email:'neha@example.com', phone:'+919876543212', gender:'Female', location:{ state:'Delhi', city:'Delhi', town:'Rohini', pincode:'110085', serviceRadiusKm:10 }, services:[{ type:'maid', rateType:'daily', rate:500 },{ type:'cook', rateType:'daily', rate:400 }], languages:['Hindi','English','Punjabi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.4, count:25 }, totalEarnings:18000 },
    { fullName:'Suresh Iyer', email:'suresh@example.com', phone:'+919876543213', gender:'Male', location:{ state:'Tamil Nadu', city:'Chennai', town:'Velachery', pincode:'600042', serviceRadiusKm:12 }, services:[{ type:'handyman', rateType:'hourly', rate:250 },{ type:'queue', rateType:'fixed', rate:200 }], languages:['Tamil','English','Hindi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.3, count:16 }, totalEarnings:11000 },
    { fullName:'Pooja Verma', email:'pooja@example.com', phone:'+919876543214', gender:'Female', location:{ state:'Madhya Pradesh', city:'Indore', town:'Vijay Nagar', pincode:'452010', serviceRadiusKm:8 }, services:[{ type:'care', rateType:'hourly', rate:200 },{ type:'tutor', rateType:'hourly', rate:400 }], languages:['Hindi','English','Marathi'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.5, count:22 }, totalEarnings:16000 },
    { fullName:'Deepak Choudhury', email:'deepak@example.com', phone:'+919876543215', gender:'Male', location:{ state:'West Bengal', city:'Kolkata', town:'Salt Lake', pincode:'700091', serviceRadiusKm:10 }, services:[{ type:'cook', rateType:'daily', rate:480 },{ type:'driver', rateType:'hourly', rate:170 }], languages:['Bengali','Hindi','English'], verificationStatus:'approved', isAvailableNow:true, rating:{ average:4.2, count:14 }, totalEarnings:10500 },
  ];
  await Provider.insertMany(providers);
  console.log(`Auto-seeded ${providers.length} Indian providers`);
}

const PORT = process.env.PORT || 5000;
async function start() {
  await connectDB();
  await autoSeed();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
start();

module.exports = { app, io };

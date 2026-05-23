import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegisterCustomer = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [details, setDetails] = useState({
    fullName: '',
    email: '',
    gender: '',
    city: '',
    town: ''
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch { /* ignore */ }
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  const handleFallbackRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register/customer', { ...details, phone });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Registration successful!');
      navigate('/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">Quick Customer Registration</h2>
          <p className="text-sm text-charcoal/70 mb-6 text-center">
            Firebase OTP is not configured. Use quick registration to create an account by phone.
          </p>
          <form onSubmit={handleFallbackRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" value={details.fullName} onChange={(e) => setDetails({ ...details, fullName: e.target.value })} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <input type="text" value={details.gender} onChange={(e) => setDetails({ ...details, gender: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input type="text" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Town</label>
              <input type="text" value={details.town} onChange={(e) => setDetails({ ...details, town: e.target.value })} className="w-full p-3 border rounded-md" />
            </div>
            <button type="submit" className="gold-btn w-full py-3">Register Customer</button>
          </form>
        </div>
      </div>
    );
  }

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const sendOTP = async () => {
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      toast.success('OTP sent to ' + phone);
    } catch (err) {
      console.error(err);
      const msg = err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Failed to send OTP. Please check the number.';
      toast.error(msg);
    }
  };

  const verifyOTP = async () => {
    try {
      const credential = await confirmationResult.confirm(otp);
      setFirebaseUser(credential.user);
      setStep(3);
      toast.success('Phone verified!');
    } catch {
      toast.error('Invalid OTP');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let idToken;
      if (firebaseUser) {
        idToken = await firebaseUser.getIdToken();
      }
      const res = await api.post('/auth/register/customer', { ...details, phone, idToken });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Registration successful!');
      navigate('/customer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full gold-border">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-gold">Customer Registration</h2>
        
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number / फ़ोन नंबर</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-primary-gold outline-none"
              placeholder="+91 XXXXX XXXXX"
            />
            <div id="recaptcha-container"></div>
            <button onClick={sendOTP} className="gold-btn w-full py-3">Send OTP / ओटीपी भेजें</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP / ओटीपी दर्ज करें</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-primary-gold outline-none"
              placeholder="XXXXXX"
            />
            <button onClick={verifyOTP} className="gold-btn w-full py-3">Verify OTP / सत्यापित करें</button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name / पूरा नाम</label>
                <input 
                  type="text" 
                  required
                  value={details.fullName}
                  onChange={(e) => setDetails({...details, fullName: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email / ईमेल</label>
                <input 
                  type="email" 
                  value={details.email}
                  onChange={(e) => setDetails({...details, email: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender / लिंग</label>
                <input 
                  type="text" 
                  value={details.gender}
                  onChange={(e) => setDetails({...details, gender: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                  placeholder="Male/Female/Other"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City / शहर</label>
                <input 
                  type="text" 
                  value={details.city}
                  onChange={(e) => setDetails({...details, city: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Town / कस्बा</label>
                <input 
                  type="text" 
                  value={details.town}
                  onChange={(e) => setDetails({...details, town: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                />
              </div>
              <button type="submit" className="gold-btn w-full py-3 mt-4">Complete Registration</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterCustomer;

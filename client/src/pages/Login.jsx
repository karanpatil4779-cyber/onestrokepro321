import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { setCurrentUser, selectedCity } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Enter any 10-digit mobile number.');
      return;
    }
    if (!sent) {
      setSent(true);
      toast.success('OTP sent. Use 1234 for this demo.');
      return;
    }
    if (otp !== '1234') {
      toast.error('Demo OTP is 1234.');
      return;
    }
    setCurrentUser({ name: 'Karan Patil', fullName: 'Karan Patil', phone, email: 'karan@example.com', city: selectedCity, role: 'customer' });
    toast.success('Login successful.');
    navigate(location.state?.from || '/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary-gold text-center mb-2">Login</h1>
        <p className="text-center text-charcoal/60 mb-6">Use any 10-digit mobile and OTP 1234.</p>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full p-3 border rounded-md" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" />
          {sent && <input className="w-full p-3 border rounded-md" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />}
          <button className="gold-btn w-full py-3">{sent ? 'Verify OTP' : 'Send OTP'}</button>
        </form>
        <p className="text-center text-sm mt-4">New here? <Link to="/signup" className="text-primary-gold font-bold">Create account</Link></p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { setCurrentUser, selectedCity } = useApp();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);

  const loginAs = (role) => {
    if (!/^\d{10}$/.test(phone)) { toast.error('Enter a valid 10-digit mobile.'); return; }
    if (!sent) { setSent(true); toast.success('OTP sent. Use 1234.'); return; }
    if (otp !== '1234') { toast.error('Demo OTP is 1234.'); return; }
    const base = { name: 'Karan Patil', fullName: 'Karan Patil', phone, email: 'karan@example.com', city: selectedCity };
    setCurrentUser(role === 'provider' ? { ...base, role: 'provider' } : { ...base, role: 'customer' });
    toast.success(`Logged in as ${role}`);
    navigate(role === 'provider' ? '/provider/dashboard' : '/dashboard');
  };

  const reset = () => { setSent(false); setOtp(''); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-bold text-primary-gold text-center">Welcome</h1>
        <p className="text-xs text-center opacity-60">10-digit mobile &bull; OTP 1234</p>
        <input className="w-full p-2.5 border rounded-md text-sm" value={phone} onChange={(e) => { reset(); setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); }} placeholder="Mobile number" />
        {sent && <input className="w-full p-2.5 border rounded-md text-sm" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />}
        {!sent ? (
          <button onClick={() => loginAs('customer')} className="gold-btn w-full py-2.5 text-sm">Send OTP</button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => loginAs('customer')} className="gold-btn py-2.5 text-sm">Login as Customer</button>
            <button onClick={() => loginAs('provider')} className="bg-charcoal dark-btn-override text-white py-2.5 rounded-md text-sm hover:opacity-90 transition-colors">Login as Provider</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-xs text-center pt-1">
          <a href="/register/customer" className="text-primary-gold font-medium hover:underline">Register as Customer</a>
          <a href="/register/provider" className="text-primary-gold font-medium hover:underline">Register as Provider</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

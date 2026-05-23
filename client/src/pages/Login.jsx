import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { findUserByPhone } from '../data/localStore';
import toast from 'react-hot-toast';

const loginCopy = {
  customer: {
    title: 'Customer Login',
    helper: 'Use a registered customer phone number to continue.',
    demo: '+919000000001',
    registerPath: '/register/customer',
    dashboardPath: '/customer/dashboard',
  },
  provider: {
    title: 'Provider Login',
    helper: 'Use a registered provider phone number to manage your profile.',
    demo: '+919876543210',
    registerPath: '/register/provider',
    dashboardPath: '/provider/dashboard',
  },
};

const Login = ({ role = 'customer' }) => {
  const copy = loginCopy[role];
  const [phone, setPhone] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = findUserByPhone(phone.trim(), role);

    if (!user) {
      toast.error(`No ${role} account found. Please register first.`);
      return;
    }

    setUser(user);
    toast.success(`${role === 'provider' ? 'Provider' : 'Customer'} login successful!`);
    navigate(copy.dashboardPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">{copy.title}</h2>
        <p className="text-sm text-charcoal/70 mb-6 text-center">{copy.helper}</p>

        <div className="mb-5 rounded-lg border border-primary-gold/20 bg-primary-ivory p-3 text-sm text-charcoal/70">
          Demo {role} phone: <button type="button" className="font-bold text-primary-gold" onClick={() => setPhone(copy.demo)}>{copy.demo}</button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className="w-full p-3 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="gold-btn w-full py-3">Login</button>
        </form>
        <p className="text-center text-sm text-charcoal/70 mt-4">
          Need an account? <Link to={copy.registerPath} className="text-primary-gold font-medium">Register here</Link>
        </p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <Link to="/login/customer" className={role === 'customer' ? 'text-primary-gold font-bold' : 'text-charcoal/50'}>Customer</Link>
          <Link to="/login/provider" className={role === 'provider' ? 'text-primary-gold font-bold' : 'text-charcoal/50'}>Provider</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

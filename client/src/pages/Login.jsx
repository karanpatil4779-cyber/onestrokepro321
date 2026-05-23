import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { findUserByPhone, saveUser } from '../data/localStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [phone, setPhone] = useState('+91');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = findUserByPhone(phone) || saveUser({
      _id: `customer_${Date.now()}`,
      role: 'customer',
      phone,
      fullName: 'Guest Customer',
      city: 'India',
      wallet: { balance: 0 },
    });

    setUser(user);
    toast.success('Login successful!');

    if (user.role === 'provider') {
      navigate('/provider/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">Login</h2>
        <p className="text-sm text-charcoal/70 mb-6 text-center">
          Enter any phone number. The frontend demo stores your session in this browser.
        </p>
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
          Don't have an account? <Link to="/register/customer" className="text-primary-gold font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

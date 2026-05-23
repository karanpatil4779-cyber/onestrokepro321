import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import api from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [phone, setPhone] = useState('+91');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { phone });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Login successful!');

      const role = res.data.user.role;
      if (role === 'provider') {
        navigate('/provider/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed. Please register first.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">Login</h2>
        <p className="text-sm text-charcoal/70 mb-6 text-center">
          Enter your registered phone number to login quickly.
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

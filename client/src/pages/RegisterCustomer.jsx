import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../data/localStore';

const RegisterCustomer = () => {
  const [phone, setPhone] = useState('+91');
  const [details, setDetails] = useState({
    fullName: '',
    email: '',
    gender: '',
    city: '',
    town: ''
  });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    const user = createCustomer({ ...details, phone });
    setUser(user);
    toast.success('Customer registration saved locally.');
    navigate('/customer/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-beige p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-primary-gold">Customer Registration</h2>
        <p className="text-sm text-charcoal/70 mb-6 text-center">
          Frontend-only mode stores this profile in your browser.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
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
};

export default RegisterCustomer;

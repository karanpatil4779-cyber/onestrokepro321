import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const RegisterCustomer = () => {
  const { cities, selectedCity, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: selectedCity });

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit mobile number.');
      return;
    }
    setCurrentUser({ ...form, fullName: form.name, role: 'customer' });
    toast.success('Account created.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-bold text-primary-gold text-center">Create Customer Account</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full p-2.5 border rounded-md text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
          <input className="w-full p-2.5 border rounded-md text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile" required />
          <input className="w-full p-2.5 border rounded-md text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" />
          <select className="w-full p-2.5 border rounded-md text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
            {cities.map((city) => <option key={city.name}>{city.name}</option>)}
          </select>
          <button className="gold-btn w-full py-2.5 text-sm">Register</button>
        </form>
        <p className="text-xs text-center opacity-60">Already have an account? <a href="/login" className="text-primary-gold font-medium hover:underline">Login</a></p>
      </div>
    </div>
  );
};

export default RegisterCustomer;

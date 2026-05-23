import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { IndianRupee, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailableNow || false);

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Top Status Bar */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`md:col-span-2 p-6 rounded-2xl flex items-center justify-between border ${
            user?.verificationStatus === 'approved' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-4">
              {user?.verificationStatus === 'approved' ? (
                <CheckCircle className="text-green-600" size={32} />
              ) : (
                <AlertTriangle className="text-amber-600" size={32} />
              )}
              <div>
                <h2 className="font-bold text-lg capitalize">Status: {user?.verificationStatus || 'Pending Review'}</h2>
                <p className="text-sm opacity-70">
                  {user?.verificationStatus === 'approved' 
                    ? 'You are verified and ready to take jobs!' 
                    : 'Our team is reviewing your documents. This usually takes 24-48 hours.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Availability</p>
              <p className="text-xs text-charcoal/50">{isAvailable ? 'Online & Visible' : 'Offline'}</p>
            </div>
            <button 
              onClick={() => setIsAvailable(!isAvailable)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-200 ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Earnings & Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Today's Earnings", value: "₹0", icon: <IndianRupee size={20}/>, color: "text-primary-gold" },
            { label: "Weekly Total", value: "₹0", icon: <TrendingUp size={20}/>, color: "text-blue-500" },
            { label: "Jobs Completed", value: "0", icon: <CheckCircle size={20}/>, color: "text-green-500" },
            { label: "Avg. Rating", value: "0.0", icon: <Star size={20}/>, color: "text-amber-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className={`p-2 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Jobs & Schedule */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Booking Requests</h2>
              <button className="text-primary-gold text-sm font-bold">View All</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-charcoal/30">
              <Clock size={48} className="mx-auto mb-4 opacity-10" />
              <p>No new requests. Stay online to get matched!</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Your Schedule</h2>
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-primary-gold" size={20} />
                <p className="font-bold">Weekly Slots</p>
              </div>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="flex justify-between items-center text-sm py-2 border-b last:border-0 border-gray-50">
                    <span className="font-medium">{day}</span>
                    <span className="text-green-600 font-bold">Available</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 border border-primary-gold text-primary-gold rounded-lg font-bold text-sm hover:bg-primary-beige transition-colors">
                Edit Schedule
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Internal Star component to avoid double import
const Star = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProviderDashboard;

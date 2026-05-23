import Navbar from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { MapPin, Wallet, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (service) => {
    navigate(`/search?service=${service.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-playfair font-bold">Namaste, {user?.fullName?.split(' ')[0]} 🙏</h1>
            <p className="text-charcoal/60 flex items-center gap-1 mt-1">
              <MapPin size={16} /> {user?.city || 'India'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-gold/10 flex items-center gap-4">
            <div className="bg-primary-gold/10 p-2 rounded-full">
              <Wallet className="text-primary-gold" />
            </div>
            <div>
              <p className="text-xs text-charcoal/50">Wallet Balance</p>
              <p className="font-bold text-lg">₹{user?.wallet?.balance || 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-primary-gold/5">
            <h2 className="text-xl font-bold mb-6">What do you need today?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'Driver', icon: '🚗' },
                { name: 'Maid', icon: '🧹' },
                { name: 'Cook', icon: '👨‍🍳' },
                { name: 'Errand', icon: '📦' },
                { name: 'Queue', icon: '🧍' },
                { name: 'Handyman', icon: '🔧' },
                { name: 'Tutor', icon: '📚' },
                { name: 'Care', icon: '🏥' },
              ].map(s => (
                <button 
                  key={s.name} 
                  onClick={() => handleSearch(s.name)}
                  className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-primary-gold hover:bg-primary-beige/30 transition-all group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="text-sm font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
             {/* Active Job Card */}
             <div className="bg-primary-gold text-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold">Active Booking</h3>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs uppercase tracking-wider">In Progress</span>
                </div>
                <p className="text-sm opacity-80">No active bookings currently. Ready to help!</p>
                <button className="w-full mt-4 py-2 bg-white text-primary-gold rounded-lg font-bold text-sm">
                  View Schedule
                </button>
             </div>

             {/* Recent Activity */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary-gold" /> Recent Jobs
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-charcoal/40 text-center py-4">No recent history</p>
                </div>
             </div>
          </div>
        </section>

        {/* Favorites Section */}
        <section>
          <h2 className="text-xl font-bold mb-6">Your Trusted Providers</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-charcoal/30 min-h-[150px]">
              <Star size={32} className="mb-2 opacity-20" />
              <p className="text-sm text-center">Save providers you love to see them here.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';
import BookingModal from '../components/BookingModal';
import api from '../services/api';
import { Filter, Search, Loader2 } from 'lucide-react';

const SearchProviders = () => {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('service') || '';
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    gender: '',
    minRating: ''
  });

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/providers/search?service=${serviceType}&city=${filters.city}&gender=${filters.gender}&minRating=${filters.minRating}`);
      setProviders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters.city, filters.gender, filters.minRating, serviceType]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchProviders();
    });
  }, [fetchProviders]);

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="font-bold flex items-center gap-2 mb-6">
                <Filter size={18} className="text-primary-gold" /> Filters
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">City</label>
                  <input 
                    type="text" 
                    className="w-full mt-1 p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                    placeholder="e.g. Mumbai"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Gender</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">Min Rating</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded focus:ring-1 focus:ring-primary-gold"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: e.target.value})}
                  >
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
                <button 
                  onClick={fetchProviders}
                  className="gold-btn w-full py-2 mt-4 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-playfair font-bold capitalize">{serviceType || 'Service'} Experts</h1>
              <p className="text-charcoal/50">Found {providers.length} verified providers matching your criteria</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-primary-gold">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-medium">Searching for best matches...</p>
              </div>
            ) : providers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {providers.map(provider => (
                  <ProviderCard 
                    key={provider._id} 
                    provider={provider} 
                    serviceType={serviceType} 
                    onBook={(p) => setSelectedProvider(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
                <Search className="mx-auto mb-4 text-charcoal/10" size={64} />
                <h3 className="text-xl font-bold mb-2">No providers found</h3>
                <p className="text-charcoal/50">Try adjusting your filters or search in a different city.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedProvider && (
        <BookingModal 
          provider={selectedProvider} 
          serviceType={serviceType} 
          onClose={() => setSelectedProvider(null)} 
        />
      )}
    </div>
  );
};

export default SearchProviders;

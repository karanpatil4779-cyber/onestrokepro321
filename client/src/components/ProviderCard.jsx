import { Heart, MapPin, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2);

const ProviderCard = ({ provider, serviceType }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, bookings } = useApp();
  const saved = favorites.includes(provider.id);
  const bookedCount = bookings.filter((booking) => booking.providerId === provider.id).length;
  const service = serviceType || provider.services[0];

  return (
    <article className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-lg bg-primary-gold/10 text-primary-gold font-bold flex items-center justify-center shrink-0">
          {initials(provider.providerName)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/provider/${provider.id}`} className="font-bold text-lg hover:text-primary-gold">{provider.providerName}</Link>
              <p className="text-xs text-charcoal/50 flex items-center gap-1 mt-1"><MapPin size={12} /> {provider.locality}, {provider.city}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(provider.id)}
              className={`p-2 rounded-full ${saved ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-charcoal/50'}`}
              title={saved ? 'Remove favorite' : 'Save provider'}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {provider.services.map((item) => (
              <span key={item} className="text-xs bg-primary-ivory border border-primary-gold/10 px-2 py-1 rounded capitalize">{item}</span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="text-primary-gold" size={14} fill="currentColor" />
              <span className="font-bold">{provider.rating}</span>
              <span className="text-charcoal/50">({provider.reviewCount})</span>
            </div>
            <p><span className="font-bold">Rs {provider.pricePerHour}</span><span className="text-charcoal/50">/hr</span></p>
            <p className="text-charcoal/60">{provider.experience} years exp.</p>
            <p className={provider.available ? 'text-green-600' : 'text-red-500'}>{provider.available ? 'Available' : 'Busy today'}</p>
          </div>

          {bookedCount > 0 && <p className="mt-3 text-xs font-bold text-primary-gold">Booked {bookedCount} times</p>}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs text-charcoal/50">{provider.languages.join(', ')} | {provider.completedJobs} jobs</p>
        <button onClick={() => navigate(`/booking/${provider.id}?service=${encodeURIComponent(service)}`)} className="gold-btn text-sm px-4 py-2">Book Now</button>
      </div>
    </article>
  );
};

export default ProviderCard;

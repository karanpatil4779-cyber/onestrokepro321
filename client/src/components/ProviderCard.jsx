import { Star, MapPin, CheckCircle } from 'lucide-react';

const ProviderCard = ({ provider, serviceType, onBook }) => {
  const serviceDetail = (provider.services || []).find(s => s.type === serviceType);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex gap-4">
        <div className="relative">
          <img 
            src={provider.profilePhoto || 'https://via.placeholder.com/100'} 
            alt={provider.fullName}
            className="w-20 h-20 rounded-xl object-cover"
          />
          {provider.verificationStatus === 'approved' && (
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <CheckCircle className="text-green-500" size={18} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary-gold transition-colors">{provider.fullName}</h3>
              <p className="text-xs text-charcoal/50 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {provider.location?.town || ''}, {provider.location?.city || ''}
              </p>
            </div>
            <div className="bg-primary-gold/10 px-2 py-1 rounded flex items-center gap-1">
              <Star className="text-primary-gold" size={14} fill="currentColor" />
              <span className="text-xs font-bold text-primary-gold">{provider.rating?.average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="text-charcoal/50">Starts at</span>
              <p className="font-bold text-lg">₹{serviceDetail?.rate || '0'}<span className="text-xs font-normal text-charcoal/40">/{serviceDetail?.rateType}</span></p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBook(provider);
              }}
              className="gold-btn py-2 px-4 text-sm"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
        {(provider.languages || []).slice(0, 3).map(lang => (
          <span key={lang} className="text-[10px] bg-gray-50 px-2 py-1 rounded text-charcoal/60 uppercase font-bold tracking-wider">
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProviderCard;

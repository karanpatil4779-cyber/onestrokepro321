import { useState } from 'react';
import { X, Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { saveBooking } from '../data/localStore';

const BookingModal = ({ provider, serviceType, onClose }) => {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceDetail = (provider.services || []).find(s => s.type === serviceType);

  const handleBooking = () => {
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      saveBooking({
        providerId: provider._id,
        providerName: provider.fullName,
        customerId: user?._id,
        customerName: user?.fullName || 'Guest Customer',
        serviceType,
        date,
        time,
        instructions,
        amount: serviceDetail?.rate || 0,
        status: 'confirmed',
      });
      toast.success('Booking confirmed in this browser.');
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-primary-beige p-6 flex justify-between items-center border-b border-primary-gold/10">
          <div>
            <h2 className="text-2xl font-playfair font-bold">Confirm Booking</h2>
            <p className="text-sm text-charcoal/50 capitalize">{serviceType} Service</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-4 items-center p-4 bg-primary-ivory rounded-xl border border-primary-gold/10">
            <img src={provider.profilePhoto || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-bold">{provider.fullName}</p>
              <p className="text-xs text-charcoal/50">Verified Professional</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold text-primary-gold">Rs {serviceDetail?.rate}</p>
              <p className="text-[10px] uppercase text-charcoal/40">Estimated Amount</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 flex items-center gap-1">
                <Calendar size={12} /> Date
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-xl focus:ring-1 focus:ring-primary-gold outline-none"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 flex items-center gap-1">
                <Clock size={12} /> Time
              </label>
              <input
                type="time"
                className="w-full p-3 border rounded-xl focus:ring-1 focus:ring-primary-gold outline-none"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50">Special Instructions (Optional)</label>
            <textarea
              className="w-full p-3 border rounded-xl focus:ring-1 focus:ring-primary-gold outline-none min-h-[100px]"
              placeholder="Any specific requests for the provider..."
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
            />
          </div>

          <div className="pt-4 space-y-4">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="gold-btn w-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary-gold/20 disabled:opacity-50"
            >
              {loading ? 'Confirming...' : (
                <>
                  <CreditCard size={20} /> Confirm Booking
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-charcoal/40 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Frontend demo mode. No payment or backend server required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

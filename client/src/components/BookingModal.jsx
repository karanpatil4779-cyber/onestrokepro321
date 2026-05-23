import { useState } from 'react';
import { X, Calendar, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { loadRazorpayScript } from '../utils/razorpay';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/useSocket';
import { useAuth } from '../context/useAuth';

const BookingModal = ({ provider, serviceType, onClose }) => {
  const { user } = useAuth();
  const { emitNewBooking } = useSocket();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceDetail = (provider.services || []).find(s => s.type === serviceType);

  const handlePayment = async () => {
    if (!date || !time) {
      return toast.error("Please select date and time");
    }

    setLoading(true);
    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 2. Create Order on backend
      const orderRes = await api.post('/payments/create-order', {
        amount: serviceDetail.rate,
        receipt: `receipt_${Date.now()}`
      });

      const { amount, id: order_id, currency } = orderRes.data;

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "ONESTROKE",
        description: `Booking for ${serviceType} with ${provider.fullName}`,
        image: "/logo.svg",
        order_id: order_id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            if (verifyRes.status === 200) {
              // Notify provider via socket
              emitNewBooking({
                providerId: provider._id,
                customerName: user.fullName,
                bookingDetails: {
                  serviceType,
                  date,
                  time,
                  instructions,
                  amount: serviceDetail.rate
                }
              });

              toast.success("Booking confirmed! Provider notified.");
              onClose();
            }
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: "#C9A84C",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
              <p className="text-lg font-bold text-primary-gold">₹{serviceDetail?.rate}</p>
              <p className="text-[10px] uppercase text-charcoal/40">Total Amount</p>
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
              onClick={handlePayment}
              disabled={loading}
              className="gold-btn w-full py-4 text-lg font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary-gold/20 disabled:opacity-50"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard size={20} /> Pay & Book Now
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-charcoal/40 flex items-center justify-center gap-1">
              <ShieldCheck size={12} /> Securely processed via Razorpay. Encrypted & Safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

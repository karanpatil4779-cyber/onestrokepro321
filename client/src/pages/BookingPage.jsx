import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CreditCard, Smartphone, WalletCards, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { getProviderById } from '../data/providers';
import { useApp } from '../context/AppContext';

const paymentOptions = ['UPI - GPay', 'UPI - PhonePe', 'UPI - Paytm', 'Credit/Debit Card', 'Net Banking', 'Wallets'];

const BookingPage = () => {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const provider = getProviderById(providerId);
  const { currentUser, createBooking } = useApp();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [duration, setDuration] = useState(2);
  const [service, setService] = useState(searchParams.get('service') || provider?.services[0] || '');
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);

  const amount = useMemo(() => {
    const serviceFee = (provider?.pricePerHour || 0) * duration;
    const platformFee = 29;
    const gst = Math.round((serviceFee + platformFee) * 0.18);
    return { serviceFee, platformFee, gst, total: serviceFee + platformFee + gst };
  }, [duration, provider]);

  if (!provider) return <div className="p-8">Provider not found.</div>;

  const confirmPayment = () => {
    if (!date) {
      toast.error('Please choose a date.');
      return;
    }
    if (!currentUser) {
      toast.error('Please login before payment.');
      navigate('/login', { state: { from: `/booking/${provider.id}?service=${encodeURIComponent(service)}` } });
      return;
    }
    const booking = createBooking({
      providerId: provider.id,
      providerName: provider.providerName,
      service,
      date,
      timeSlot,
      duration,
      totalAmount: amount.total,
      paymentMethod,
      city: provider.city,
      locality: provider.locality,
    });
    toast.success(`Booking confirmed! ${booking.bookingId}`);
    navigate('/booking/success', { state: { bookingId: booking.bookingId } });
  };

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Book {provider.providerName}</h1>
        <div className="grid md:grid-cols-[1fr_360px] gap-6">
          <section className="bg-white rounded-lg border border-gray-100 p-6 space-y-4">
            <label className="block font-bold">Service</label>
            <select className="w-full p-3 border rounded-md capitalize" value={service} onChange={(e) => setService(e.target.value)}>
              {provider.services.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label className="block font-bold">Date</label>
            <input type="date" className="w-full p-3 border rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
            <label className="block font-bold">Time slot</label>
            <select className="w-full p-3 border rounded-md" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
              <option>08:00 AM - 10:00 AM</option>
              <option>10:00 AM - 12:00 PM</option>
              <option>02:00 PM - 04:00 PM</option>
              <option>05:00 PM - 07:00 PM</option>
            </select>
            <label className="block font-bold">Duration: {duration} hours</label>
            <input type="range" min="1" max="6" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full" />
          </section>

          <aside className="bg-white rounded-lg border border-gray-100 p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Booking summary</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-charcoal/50">Service:</span> <span className="capitalize font-bold">{service}</span></p>
              <p><span className="text-charcoal/50">Provider:</span> {provider.providerName}</p>
              <p><span className="text-charcoal/50">Slot:</span> {date}, {timeSlot}</p>
              <p><span className="text-charcoal/50">Duration:</span> {duration} hours</p>
            </div>
            <div className="border-t border-gray-100 mt-5 pt-5 space-y-2">
              <div className="flex justify-between"><span>Service fee</span><span>Rs {amount.serviceFee}</span></div>
              <div className="flex justify-between"><span>Platform fee</span><span>Rs {amount.platformFee}</span></div>
              <div className="flex justify-between"><span>GST 18%</span><span>Rs {amount.gst}</span></div>
              <div className="flex justify-between text-lg font-bold border-t pt-3"><span>Total</span><span>Rs {amount.total}</span></div>
            </div>
            <button onClick={() => setPaying(true)} className="gold-btn w-full mt-6 py-3">Pay Rs {amount.total}</button>
          </aside>
        </div>
      </main>

      {paying && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#0b5fff] text-white p-4 flex justify-between">
              <div>
                <p className="font-bold">Razorpay Checkout</p>
                <p className="text-sm opacity-80">OneStroke Pro | rzp_test_XXXX</p>
              </div>
              <button onClick={() => setPaying(false)}><X /></button>
            </div>
            <div className="p-5 space-y-4">
              <input className="w-full p-3 border rounded-md" value={currentUser?.name || currentUser?.fullName || ''} readOnly />
              <input className="w-full p-3 border rounded-md" value={currentUser?.email || ''} readOnly />
              <input className="w-full p-3 border rounded-md" value={currentUser?.phone || ''} readOnly />
              <div className="grid gap-2">
                {paymentOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 border rounded-md p-3">
                    <input type="radio" checked={paymentMethod === option} onChange={() => setPaymentMethod(option)} />
                    {option.includes('UPI') ? <Smartphone size={18} /> : option.includes('Card') ? <CreditCard size={18} /> : <WalletCards size={18} />}
                    {option}
                  </label>
                ))}
              </div>
              <button onClick={confirmPayment} className="w-full bg-[#0b5fff] text-white rounded-md py-3 font-bold">Pay Rs {amount.total}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

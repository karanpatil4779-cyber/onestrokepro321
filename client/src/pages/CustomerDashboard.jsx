import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bell, Calendar, CircleHelp, Download, Heart, MapPin, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import CitySelector from '../components/CitySelector';
import ProviderCard from '../components/ProviderCard';
import { useApp } from '../context/AppContext';

const badgeClass = {
  Confirmed: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  Completed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const isWithinTwoHours = (booking) => {
  const start = new Date(`${booking.date} ${booking.timeSlot.split(' - ')[0]}`);
  return start.getTime() - Date.now() < 2 * 60 * 60 * 1000;
};

const canReschedule = (booking) => {
  const start = new Date(`${booking.date} ${booking.timeSlot.split(' - ')[0]}`);
  return start.getTime() - Date.now() > 24 * 60 * 60 * 1000;
};

const Receipt = ({ booking }) => {
  const gst = Math.round(booking.totalAmount * 18 / 118);
  return (
    <button onClick={() => {
      const html = `<h1>OneStroke Pro</h1><p>Booking ID: ${booking.bookingId}</p><p>Provider: ${booking.providerName}</p><p>Service: ${booking.service}</p><p>Date: ${booking.date}</p><p>Amount: Rs ${booking.totalAmount}</p><p>GST: Rs ${gst}</p>`;
      const win = window.open('', '_blank');
      win.document.write(html);
      win.print();
    }} className="text-sm border px-3 py-2 rounded-md flex items-center gap-2"><Download size={16} /> Download Receipt</button>
  );
};

const BookingCard = ({ booking, onCancel, onReschedule, onReview }) => {
  const navigate = useNavigate();
  const completed = booking.status === 'Completed';

  return (
    <article className="bg-white border border-gray-100 rounded-lg p-5">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold capitalize">{booking.service}</h3>
          <p>Provider: {booking.providerName}</p>
          <p className="text-charcoal/70"><Calendar size={16} className="inline mr-1" /> {booking.date}, {booking.timeSlot}</p>
          <p className="text-charcoal/70"><MapPin size={16} className="inline mr-1" /> {booking.locality}, {booking.city}</p>
          <p className="font-bold">Rs {booking.totalAmount} paid via {booking.paymentMethod}</p>
          <p className="text-sm text-charcoal/50">Booking ID: {booking.bookingId}</p>
          {booking.refundStatus === 'Refund Initiated' && <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">Refund Initiated</span>}
        </div>
        <div className="flex flex-col gap-2 items-start md:items-end">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${badgeClass[booking.status]}`}>{booking.status}</span>
          {booking.status === 'Confirmed' && (
            <button disabled={isWithinTwoHours(booking)} onClick={() => onCancel(booking)} className="text-sm border px-3 py-2 rounded-md disabled:opacity-40">Cancel</button>
          )}
          {booking.status === 'Confirmed' && canReschedule(booking) && <button onClick={() => onReschedule(booking)} className="text-sm border px-3 py-2 rounded-md">Reschedule</button>}
          {completed && <button onClick={() => navigate(`/booking/${booking.providerId}?service=${encodeURIComponent(booking.service)}`)} className="text-sm border px-3 py-2 rounded-md">Book Again</button>}
          {completed && <button onClick={() => onReview(booking)} className="text-sm border px-3 py-2 rounded-md">Rate your experience</button>}
          {completed && <Receipt booking={booking} />}
        </div>
      </div>
    </article>
  );
};

const CustomerDashboard = ({ view = 'overview' }) => {
  const {
    currentUser,
    bookings,
    cancelBooking,
    updateBooking,
    favorites,
    providers,
    addresses,
    setAddresses,
    refundMessages,
    dismissRefundMessage,
    addReview,
    selectedCity,
  } = useApp();
  const { bookingId } = useParams();
  const [tab, setTab] = useState('All Bookings');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [newSlot, setNewSlot] = useState({ date: '', timeSlot: '10:00 AM - 12:00 PM' });
  const [review, setReview] = useState({ rating: 5, text: '' });
  const [address, setAddress] = useState('');

  const visibleBookings = useMemo(() => {
    const list = bookingId ? bookings.filter((booking) => booking.bookingId === bookingId) : bookings;
    if (tab === 'Upcoming') return list.filter((booking) => ['Confirmed', 'In Progress'].includes(booking.status));
    if (tab === 'Completed') return list.filter((booking) => booking.status === 'Completed');
    if (tab === 'Cancelled') return list.filter((booking) => booking.status === 'Cancelled');
    return list;
  }, [bookingId, bookings, tab]);

  const totalSpent = bookings.filter((booking) => booking.status !== 'Cancelled').reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  const favoriteProviders = providers.filter((provider) => favorites.includes(provider.id));

  const confirmCancel = () => {
    const fullRefund = cancelBooking(cancelTarget);
    toast.success(fullRefund ? `Booking cancelled. Rs ${cancelTarget.totalAmount} refund initiated.` : 'Booking cancelled. No refund applicable.');
    setCancelTarget(null);
  };

  const openCancel = (booking) => {
    setCancelTarget({
      ...booking,
      fullRefundPreview: (Date.now() - booking.bookedAt) / 60000 <= 30,
    });
  };

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-80 space-y-4">
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h2 className="font-bold flex items-center gap-2"><User size={18} /> My Profile</h2>
              <p className="mt-3 font-bold">{currentUser?.name || currentUser?.fullName}</p>
              <p className="text-sm text-charcoal/60">{currentUser?.email}</p>
              <p className="text-sm text-charcoal/60">{currentUser?.phone}</p>
              <p className="text-sm text-charcoal/60">{currentUser?.city || selectedCity}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <h2 className="font-bold mb-3">Saved Addresses</h2>
              <div className="space-y-2">
                {addresses.map((item) => <p key={item} className="text-sm flex justify-between gap-2">{item}<button onClick={() => setAddresses(addresses.filter((addr) => addr !== item))}><X size={14} /></button></p>)}
              </div>
              <div className="flex gap-2 mt-3">
                <input className="min-w-0 flex-1 border rounded-md px-2 py-1 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Add address" />
                <button onClick={() => { if (address) setAddresses([...addresses, address]); setAddress(''); }} className="text-sm gold-btn px-3">Add</button>
              </div>
            </div>
            <Link to="/dashboard/favorites" className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-2"><Heart size={18} /> Favorites ({favorites.length})</Link>
            <button onClick={() => window.dispatchEvent(new Event('osp-open-assistant'))} className="w-full bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-2"><CircleHelp size={18} /> Help</button>
            <label className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-2"><Bell size={18} /> Notifications <input className="ml-auto" type="checkbox" defaultChecked /></label>
          </aside>

          <section className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {(currentUser?.name || currentUser?.fullName || 'there').split(' ')[0]}</h1>
                <p className="text-charcoal/60">Manage bookings, refunds, reviews and saved providers.</p>
              </div>
              <CitySelector compact />
            </div>

            {refundMessages.map((item) => (
              <div key={item.id} className="bg-green-50 text-green-800 border border-green-100 rounded-lg p-3 flex justify-between gap-3">
                <span>{item.text}</span>
                <button onClick={() => dismissRefundMessage(item.id)}><X size={16} /></button>
              </div>
            ))}

            <div className="grid sm:grid-cols-4 gap-4">
              {[
                ['Total Bookings', bookings.length],
                ['Active Bookings', bookings.filter((booking) => ['Confirmed', 'In Progress'].includes(booking.status)).length],
                ['Total Spent', `Rs ${totalSpent}`],
                ['Saved Providers', favorites.length],
              ].map(([label, value]) => (
                <div key={label} className="bg-white border border-gray-100 rounded-lg p-4">
                  <p className="text-sm text-charcoal/50">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            {view === 'favorites' ? (
              <div className="grid md:grid-cols-2 gap-5">
                {favoriteProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
              </div>
            ) : view === 'profile' ? (
              <div className="bg-white border border-gray-100 rounded-lg p-6">Profile editing is saved from signup/login in this demo.</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {['All Bookings', 'Upcoming', 'Completed', 'Cancelled'].map((item) => (
                    <button key={item} onClick={() => setTab(item)} className={`px-4 py-2 rounded-md ${tab === item ? 'bg-charcoal text-white' : 'bg-white border'}`}>{item}</button>
                  ))}
                </div>
                <div className="space-y-4">
                  {visibleBookings.length ? visibleBookings.map((booking) => (
                    <BookingCard key={booking.bookingId} booking={booking} onCancel={openCancel} onReschedule={(item) => { setRescheduleTarget(item); setNewSlot({ date: item.date, timeSlot: item.timeSlot }); }} onReview={setReviewTarget} />
                  )) : <div className="bg-white rounded-lg border border-dashed border-gray-200 p-10 text-center">No bookings here yet.</div>}
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-3">Cancel Booking?</h2>
            <p>Are you sure you want to cancel {cancelTarget.service} with {cancelTarget.providerName} on {cancelTarget.date}?</p>
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 my-4 text-sm">
              {cancelTarget.fullRefundPreview
                ? `Since this booking was made less than 30 minutes ago, you are eligible for a FULL REFUND of Rs ${cancelTarget.totalAmount}. Refund will be processed to your original payment method within 5-7 business days.`
                : 'This booking is not eligible for a refund as it was made more than 30 minutes ago.'}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelTarget(null)} className="border px-4 py-2 rounded-md">Keep Booking</button>
              <button onClick={confirmCancel} className="bg-red-600 text-white px-4 py-2 rounded-md">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rescheduleTarget && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold">Reschedule</h2>
            <input type="date" className="w-full border rounded-md p-3" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} />
            <select className="w-full border rounded-md p-3" value={newSlot.timeSlot} onChange={(e) => setNewSlot({ ...newSlot, timeSlot: e.target.value })}>
              <option>08:00 AM - 10:00 AM</option><option>10:00 AM - 12:00 PM</option><option>02:00 PM - 04:00 PM</option><option>05:00 PM - 07:00 PM</option>
            </select>
            <button onClick={() => { updateBooking(rescheduleTarget.bookingId, newSlot); setRescheduleTarget(null); toast.success('Booking rescheduled.'); }} className="gold-btn w-full">Save Slot</button>
          </div>
        </div>
      )}

      {reviewTarget && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold">Rate your experience</h2>
            <select className="w-full border rounded-md p-3" value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea className="w-full border rounded-md p-3" placeholder="Optional review" value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} />
            <button onClick={() => { addReview({ ...review, providerId: reviewTarget.providerId, bookingId: reviewTarget.bookingId }); setReviewTarget(null); toast.success('Review saved.'); }} className="gold-btn w-full">Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

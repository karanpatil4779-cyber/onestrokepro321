import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/dashboard'), 3000);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-primary-beige flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-3">Booking confirmed</h1>
        <p className="text-charcoal/70 mb-6">{bookingId || 'Your booking'} is confirmed. Redirecting to dashboard...</p>
        <Link to="/dashboard" className="gold-btn">Go to dashboard</Link>
      </div>
    </div>
  );
};

export default BookingSuccess;

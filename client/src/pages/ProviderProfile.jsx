import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Languages, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getProviderById } from '../data/providers';
import { useApp } from '../context/AppContext';

const slots = ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM'];

const ProviderProfile = () => {
  const { id } = useParams();
  const provider = getProviderById(id);
  const { reviews } = useApp();
  const providerReviews = reviews.filter((review) => review.providerId === id);

  if (!provider) return <div className="p-8">Provider not found.</div>;

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <section className="bg-white border border-gray-100 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">{provider.providerName}</h1>
              <p className="text-charcoal/60 mt-2">{provider.locality}, {provider.city}</p>
              <div className="flex items-center gap-2 mt-4">
                <Star size={18} className="text-primary-gold" fill="currentColor" />
                <span className="font-bold">{provider.rating}</span>
                <span className="text-charcoal/50">({provider.reviewCount + providerReviews.length} reviews)</span>
              </div>
            </div>
            <Link to={`/booking/${provider.id}?service=${encodeURIComponent(provider.services[0])}`} className="gold-btn text-center">Book This Provider</Link>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-primary-ivory p-4 rounded-lg"><p className="text-sm text-charcoal/50">Experience</p><p className="font-bold">{provider.experience} years</p></div>
            <div className="bg-primary-ivory p-4 rounded-lg"><p className="text-sm text-charcoal/50">Price</p><p className="font-bold">Rs {provider.pricePerHour}/hr</p></div>
            <div className="bg-primary-ivory p-4 rounded-lg"><p className="text-sm text-charcoal/50">Jobs</p><p className="font-bold">{provider.completedJobs}</p></div>
            <div className="bg-primary-ivory p-4 rounded-lg"><p className="text-sm text-charcoal/50">Availability</p><p className={provider.available ? 'font-bold text-green-600' : 'font-bold text-red-500'}>{provider.available ? 'Available' : 'Busy'}</p></div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Services offered</h2>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service) => <span key={service} className="capitalize px-3 py-2 bg-primary-ivory rounded-md">{service}</span>)}
            </div>
            <p className="flex gap-2 items-center mt-6 text-charcoal/70"><Languages size={18} /> {provider.languages.join(', ')}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays size={20} /> Next 7 days</h2>
            <div className="grid gap-3">
              {Array.from({ length: 7 }, (_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                return (
                  <div key={date.toISOString()} className="flex justify-between gap-3 border-b border-gray-100 pb-2">
                    <span className="font-medium">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-sm text-charcoal/60">{slots[(index + provider.experience) % slots.length]}, {slots[(index + 2) % slots.length]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
          {providerReviews.length ? providerReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 py-3">
              <p className="font-bold">{review.rating}/5 stars</p>
              <p className="text-charcoal/70">{review.text || 'No written review.'}</p>
            </div>
          )) : <p className="text-charcoal/50">No local reviews yet.</p>}
        </section>
      </main>
    </div>
  );
};

export default ProviderProfile;

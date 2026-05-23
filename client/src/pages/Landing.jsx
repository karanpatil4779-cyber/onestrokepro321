import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, MapPin, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import CitySelector from '../components/CitySelector';
import ProviderCard from '../components/ProviderCard';
import { SERVICE_CATEGORIES } from '../data/providers';
import { useApp } from '../context/AppContext';

const seasonalCopy = () => {
  const month = new Date().getMonth() + 1;
  if ([5, 6].includes(month)) return 'Beat the heat! Book AC service today.';
  if ([10, 11].includes(month)) return 'Pre-winter pest control - book now.';
  if ([12, 1].includes(month)) return 'Cold water heater repair - priority slots available.';
  return 'Verified home services across Indian cities.';
};

const Landing = () => {
  const { providers, selectedCity } = useApp();
  const featured = providers.filter((provider) => provider.city === selectedCity).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <header className="bg-primary-beige px-4 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-sm font-bold text-primary-gold uppercase tracking-widest mb-4">{seasonalCopy()}</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">OneStroke Pro</h1>
            <p className="text-xl text-charcoal/70 mb-8 max-w-2xl">
              Book trusted plumbers, electricians, cleaners, AC repair experts, carpenters, painters and more in your city.
            </p>
            <div className="max-w-2xl bg-white border border-primary-gold/10 rounded-lg p-3 flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 px-2">
                <Search size={18} className="text-primary-gold" />
                <input className="w-full outline-none" placeholder="Search services or providers..." onKeyDown={(e) => {
                  if (e.key === 'Enter') window.location.href = `/services?query=${encodeURIComponent(e.currentTarget.value)}`;
                }} />
              </div>
              <CitySelector compact />
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/services" className="gold-btn text-lg py-3 px-8">Book a Service</Link>
              <Link to="/signup" className="bg-white border border-primary-gold text-primary-gold px-8 py-3 rounded-md hover:bg-primary-ivory">Sign up</Link>
            </div>
          </div>
          <div className="min-h-[360px] rounded-lg overflow-hidden bg-[url('/src/assets/hero.png')] bg-cover bg-center border border-primary-gold/10" />
        </div>
      </header>

      <section className="py-14 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Popular services in {selectedCity}</h2>
            <p className="text-charcoal/60">Filter by service, price, rating, availability and experience.</p>
          </div>
          <Link to="/services" className="text-primary-gold font-bold">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SERVICE_CATEGORIES.map((service) => (
            <Link key={service} to={`/services/${encodeURIComponent(service)}`} className="bg-white border border-gray-100 rounded-lg p-4 capitalize hover:border-primary-gold">
              {service}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 bg-primary-off-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured providers</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {[
            [ShieldCheck, 'Verified Experts', 'Every provider is quality checked for this demo marketplace.'],
            [Clock, 'Fast Booking', 'Choose a slot, review the summary, and complete mock Razorpay payment.'],
            [MapPin, 'Hyper Local', 'Providers are organized by Indian cities and neighbourhoods.'],
          ].map(([Icon, title, text]) => (
            <div key={title}>
              <div className="bg-primary-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                <Icon className="text-primary-gold" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;

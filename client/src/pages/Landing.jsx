import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-primary-beige py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            One Request. <span className="text-primary-gold underline decoration-primary-gold/30">One Stroke.</span> Done.
          </h1>
          <p className="text-xl text-charcoal/70 mb-10 max-w-2xl mx-auto">
            Premium on-demand services for the modern Indian home. Aadhaar-verified professionals at your doorstep.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register/customer" className="gold-btn text-lg py-3 px-8">Book a Service</Link>
            <Link to="/register/provider" className="bg-white border border-primary-gold text-primary-gold px-8 py-3 rounded-md hover:bg-primary-ivory transition-colors">
              Become a Provider
            </Link>
            <Link to="/login/customer" className="bg-charcoal text-white px-8 py-3 rounded-md hover:bg-black transition-colors">
              Customer Login
            </Link>
            <Link to="/login/provider" className="bg-white border border-charcoal text-charcoal px-8 py-3 rounded-md hover:bg-primary-ivory transition-colors">
              Provider Login
            </Link>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Specialized Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Driver', icon: '🚗', hindi: 'ड्राइवर' },
            { name: 'Maid', icon: '🧹', hindi: 'कामवाली' },
            { name: 'Cook', icon: '👨‍🍳', hindi: 'रसोइया' },
            { name: 'Errand', icon: '📦', hindi: 'काम' },
            { name: 'Queue', icon: '🧍', hindi: 'लाइन असिस्टेंट' },
            { name: 'Handyman', icon: '🔧', hindi: 'मिस्त्री' },
            { name: 'Tutor', icon: '📚', hindi: 'ट्यूटर' },
            { name: 'Care', icon: '🏥', hindi: 'देखभाल' },
          ].map((service) => (
            <div key={service.name} className="beige-card text-center">
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="text-sm text-charcoal/50">{service.hindi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-charcoal text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="bg-primary-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-primary-gold" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Experts</h3>
            <p className="text-white/60">Strict Aadhaar & Police verification for every provider.</p>
          </div>
          <div>
            <div className="bg-primary-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-primary-gold" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Swift Response</h3>
            <p className="text-white/60">Book in 60 seconds. Service at your convenience.</p>
          </div>
          <div>
            <div className="bg-primary-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-primary-gold" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Hyper-Local</h3>
            <p className="text-white/60">Serving major Indian metros with dedicated local support.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-beige py-12 px-4 border-t border-primary-gold/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-playfair font-bold text-primary-gold mb-4 uppercase tracking-widest">ONESTROKE</h2>
          <p className="text-charcoal/50 mb-8">© 2026 ONESTROKE. Built for Bharat. 🇮🇳</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-primary-gold">About</a>
            <a href="#" className="hover:text-primary-gold">Privacy</a>
            <a href="#" className="hover:text-primary-gold">Terms</a>
            <a href="#" className="hover:text-primary-gold">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

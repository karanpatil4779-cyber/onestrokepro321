import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';
import { SERVICE_CATEGORIES } from '../data/providers';
import { useApp } from '../context/AppContext';

const ServicesPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { providers, cities, selectedCity, setSelectedCity } = useApp();
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    service: category ? decodeURIComponent(category) : '',
    rating: '',
    maxPrice: '800',
    available: false,
    sort: 'rating',
  });

  const results = useMemo(() => {
    const query = filters.query.toLowerCase();
    return providers
      .filter((provider) => provider.city === selectedCity)
      .filter((provider) => !filters.service || provider.services.includes(filters.service))
      .filter((provider) => !query || provider.providerName.toLowerCase().includes(query) || provider.services.some((service) => service.includes(query)))
      .filter((provider) => !filters.rating || provider.rating >= Number(filters.rating))
      .filter((provider) => provider.pricePerHour <= Number(filters.maxPrice))
      .filter((provider) => !filters.available || provider.available)
      .sort((a, b) => {
        if (filters.sort === 'price') return a.pricePerHour - b.pricePerHour;
        if (filters.sort === 'experience') return b.experience - a.experience;
        if (filters.sort === 'booked') return b.completedJobs - a.completedJobs;
        return b.rating - a.rating;
      });
  }, [filters, providers, selectedCity]);

  return (
    <div className="min-h-screen bg-primary-off-white">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{filters.service ? `${filters.service} providers` : 'All services'}</h1>
          <p className="text-charcoal/60">{results.length} providers in {selectedCity}</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white rounded-lg border border-gray-100 p-5 h-fit space-y-4">
            <input className="w-full p-3 border rounded-md" placeholder="Search services or providers..." value={filters.query} onChange={(e) => setFilters({ ...filters, query: e.target.value })} />
            <select className="w-full p-3 border rounded-md" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {cities.map((city) => <option key={city.name}>{city.name}</option>)}
            </select>
            <select className="w-full p-3 border rounded-md capitalize" value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
              <option value="">All service types</option>
              {SERVICE_CATEGORIES.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
            <select className="w-full p-3 border rounded-md" value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
              <option value="">Any rating</option>
              <option value="4">4+ rating</option>
              <option value="4.5">4.5+ rating</option>
            </select>
            <label className="block text-sm font-bold">Max price: Rs {filters.maxPrice}/hr</label>
            <input type="range" min="200" max="800" step="50" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-full" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.available} onChange={(e) => setFilters({ ...filters, available: e.target.checked })} /> Available now</label>
            <select className="w-full p-3 border rounded-md" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="rating">Sort by rating</option>
              <option value="price">Price low-high</option>
              <option value="experience">Experience</option>
              <option value="booked">Most booked</option>
            </select>
          </aside>

          <div className="grid md:grid-cols-2 gap-5">
            {results.map((provider) => <ProviderCard key={provider.id} provider={provider} serviceType={filters.service} />)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;

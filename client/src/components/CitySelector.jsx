import { LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const CitySelector = ({ compact = false }) => {
  const { cities, selectedCity, setSelectedCity } = useApp();

  const detectCity = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        const city = cities.find((item) => item.name === 'Mumbai')?.name || cities[0].name;
        setSelectedCity(city);
        toast.success(`Detected ${city} for this demo.`);
      },
      () => toast.error('Could not detect city. Please choose manually.')
    );
  };

  return (
    <div className={`flex ${compact ? 'flex-row' : 'flex-col sm:flex-row'} gap-3`}>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="min-w-48 rounded-md border border-primary-gold/20 bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-primary-gold"
      >
        {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
      </select>
      <button type="button" onClick={detectCity} className="border border-primary-gold text-primary-gold px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-primary-ivory">
        <LocateFixed size={16} /> Detect my city
      </button>
    </div>
  );
};

export default CitySelector;

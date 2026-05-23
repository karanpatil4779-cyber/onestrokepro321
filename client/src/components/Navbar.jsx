import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, MapPin, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { currentUser, logout, cities, selectedCity, setSelectedCity, notifications, setNotifications, theme, toggleTheme } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter((item) => !item.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = currentUser ? (
    <>
      <div className="text-sm font-bold px-3 py-2 border-b border-gray-200">{currentUser?.name || currentUser?.fullName}</div>
      <Link to="/dashboard" className="block px-3 py-2 hover:text-primary-gold text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-500 hover:bg-primary-beige text-sm">Logout</button>
    </>
  ) : (
    <>
      <div className="text-xs font-bold text-primary-gold uppercase tracking-widest px-3 pt-2 pb-1">Login</div>
      <Link to="/login" className="block px-3 py-2 hover:text-primary-gold text-sm font-medium" onClick={() => setMenuOpen(false)}>Login as Customer</Link>
      <Link to="/login" className="block px-3 py-2 hover:text-primary-gold text-sm font-medium" onClick={() => setMenuOpen(false)}>Login as Provider</Link>
      <div className="text-xs font-bold text-primary-gold uppercase tracking-widest px-3 pt-3 pb-1">Register</div>
      <Link to="/register/customer" className="block px-3 py-2 hover:text-primary-gold text-sm" onClick={() => setMenuOpen(false)}>Register as Customer</Link>
      <Link to="/register/provider" className="block px-3 py-2 hover:text-primary-gold text-sm" onClick={() => setMenuOpen(false)}>Register as Provider</Link>
    </>
  );

  return (
    <nav className="bg-white border-b border-primary-gold/10 py-3 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-playfair font-bold text-primary-gold tracking-widest">
          ONESTROKE
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/services" className="hover:text-primary-gold">Services</Link>
          <Link to="/dashboard" className="hover:text-primary-gold">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 text-charcoal/70 hover:text-primary-gold hover:border-primary-gold"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <label className="hidden sm:flex items-center gap-2 text-sm border rounded-md px-2 py-1.5">
            <MapPin size={16} className="text-primary-gold" />
            <select className="outline-none bg-transparent" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              {cities.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
            </select>
          </label>

          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setNotifications(notifications.map((item) => ({ ...item, read: true })));
              }}
              className="relative text-charcoal/60 hover:text-primary-gold transition-colors p-2"
              title="Notifications"
            >
              <Bell size={20} />
              {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{unread}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-lg shadow-xl p-3">
                <h3 className="font-bold mb-2">Notifications</h3>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {notifications.length ? notifications.slice(0, 8).map((item) => (
                    <p key={item.id} className="text-sm bg-primary-ivory rounded-md p-2">{item.message}</p>
                  )) : <p className="text-sm text-charcoal/50 p-3">No notifications yet.</p>}
                </div>
              </div>
            )}
          </div>

          {currentUser && (
            <div className="items-center gap-2 border-l pl-3 border-gray-200 hidden md:flex">
              <div className="text-right">
                <p className="text-sm font-bold">{currentUser?.name || currentUser?.fullName}</p>
                <p className="text-xs text-charcoal/50">{currentUser?.city || selectedCity}</p>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-primary-beige rounded-full text-red-500 transition-colors" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-charcoal/70 hover:text-primary-gold">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 mt-3 py-2 space-y-0.5">
          <Link to="/services" className="block px-3 py-2 hover:text-primary-gold text-sm" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/dashboard" className="block px-3 py-2 hover:text-primary-gold text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <div className="border-t border-gray-200 my-2" />
          {authLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

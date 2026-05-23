import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-primary-gold/10 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-playfair font-bold text-primary-gold tracking-widest">
          ONESTROKE
        </Link>

        <div className="flex items-center gap-6">
          <button className="text-charcoal/60 hover:text-primary-gold transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold">{user?.fullName || 'User'}</p>
              <p className="text-xs text-charcoal/50 capitalize">{user?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-primary-beige rounded-full text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

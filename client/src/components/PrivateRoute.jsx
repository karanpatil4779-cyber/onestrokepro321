import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const PrivateRoute = () => {
  const { currentUser } = useApp();
  const location = useLocation();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default PrivateRoute;

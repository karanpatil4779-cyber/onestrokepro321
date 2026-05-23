import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterProvider from './pages/RegisterProvider';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ServicesPage from './pages/ServicesPage';
import ProviderProfile from './pages/ProviderProfile';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import PrivateRoute from './components/PrivateRoute';
import AIAssistant from './components/AIAssistant';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppProvider>
          <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:category" element={<ServicesPage />} />
              <Route path="/provider/:id" element={<ProviderProfile />} />
              <Route path="/booking/:providerId" element={<BookingPage />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<RegisterCustomer />} />
              <Route path="/register/customer" element={<RegisterCustomer />} />
              <Route path="/register/provider" element={<RegisterProvider />} />
              <Route path="/search" element={<ServicesPage />} />
              <Route path="/customer/dashboard" element={<Navigate to="/dashboard" replace />} />

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/dashboard/bookings" element={<CustomerDashboard view="bookings" />} />
                <Route path="/dashboard/bookings/:bookingId" element={<CustomerDashboard view="booking" />} />
                <Route path="/dashboard/favorites" element={<CustomerDashboard view="favorites" />} />
                <Route path="/dashboard/profile" element={<CustomerDashboard view="profile" />} />
              </Route>

              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            <AIAssistant />
          </Router>
        </AppProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

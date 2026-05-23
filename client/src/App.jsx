import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterProvider from './pages/RegisterProvider';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchProviders from './pages/SearchProviders';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login role="customer" />} />
            <Route path="/login/customer" element={<Login role="customer" />} />
            <Route path="/login/provider" element={<Login role="provider" />} />
            <Route path="/register/customer" element={<RegisterCustomer />} />
            <Route path="/register/provider" element={<RegisterProvider />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/search" element={<SearchProviders />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

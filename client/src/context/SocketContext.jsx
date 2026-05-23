import { useEffect } from 'react';
import socket from '../services/socket';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import { SocketContext } from './socketContextValue';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      // Join private room on connection
      socket.emit('join_user_room', user._id);

      // Listen for incoming bookings (Providers)
      socket.on('incoming_booking', (data) => {
        toast.success(data.message, {
          duration: 10000,
          icon: '🔔',
        });
        // We could also play a sound or trigger a modal here
      });

      // Listen for status updates (Customers)
      socket.on('booking_status_update', (data) => {
        toast(() => (
          <span>
            <b>ONESTROKE Update:</b> {data.message}
          </span>
        ), {
            duration: 6000,
            icon: '✅',
        });
      });
    }

    return () => {
      socket.off('incoming_booking');
      socket.off('booking_status_update');
    };
  }, [user]);

  const emitNewBooking = (data) => {
    socket.emit('new_booking_request', data);
  };

  const emitBookingResponse = (data) => {
    socket.emit('booking_response', data);
  };

  return (
    <SocketContext.Provider value={{ emitNewBooking, emitBookingResponse }}>
      {children}
    </SocketContext.Provider>
  );
};

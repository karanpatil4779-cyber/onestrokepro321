import { SocketContext } from './socketContextValue';

export const SocketProvider = ({ children }) => {
  const emitNewBooking = () => {};
  const emitBookingResponse = () => {};

  return (
    <SocketContext.Provider value={{ emitNewBooking, emitBookingResponse }}>
      {children}
    </SocketContext.Provider>
  );
};

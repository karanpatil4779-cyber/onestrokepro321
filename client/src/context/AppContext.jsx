/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { CITIES, PROVIDERS } from '../data/providers';
import { keys, load, remove, save } from '../data/storage';

const AppContext = createContext(null);

export const makeBookingId = () => {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `OSP-${stamp}-${suffix}`;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(() => load(keys.currentUser, null));
  const [selectedCity, setSelectedCityState] = useState(() => load(keys.selectedCity, 'Mumbai'));
  const [bookings, setBookings] = useState(() => load(keys.bookings, []));
  const [notifications, setNotifications] = useState(() => load(keys.notifications, []));
  const [favorites, setFavorites] = useState(() => load(keys.favorites, []));
  const [reviews, setReviews] = useState(() => load(keys.reviews, []));
  const [addresses, setAddresses] = useState(() => load(keys.addresses, ['Home - Andheri West, Mumbai']));
  const [refundMessages, setRefundMessages] = useState(() => load(keys.refundMessages, []).filter((item) => Date.now() - item.createdAt < 7 * 24 * 60 * 60 * 1000));
  const [theme, setTheme] = useState(() => load(keys.theme, 'light'));

  useEffect(() => save(keys.currentUser, currentUser), [currentUser]);
  useEffect(() => save(keys.selectedCity, selectedCity), [selectedCity]);
  useEffect(() => save(keys.bookings, bookings), [bookings]);
  useEffect(() => save(keys.notifications, notifications), [notifications]);
  useEffect(() => save(keys.favorites, favorites), [favorites]);
  useEffect(() => save(keys.reviews, reviews), [reviews]);
  useEffect(() => save(keys.addresses, addresses), [addresses]);
  useEffect(() => save(keys.refundMessages, refundMessages), [refundMessages]);
  useEffect(() => {
    save(keys.theme, theme);
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const setCurrentUser = (user) => {
    setCurrentUserState(user);
    if (user?.city) setSelectedCityState(user.city);
  };

  const logout = () => {
    remove(keys.currentUser);
    setCurrentUserState(null);
  };

  const setSelectedCity = (city) => {
    setSelectedCityState(city);
    if (currentUser) setCurrentUserState({ ...currentUser, city });
  };

  const addNotification = (message, type = 'info') => {
    setNotifications((items) => [
      { id: `note_${Date.now()}`, message, type, read: false, createdAt: Date.now() },
      ...items,
    ]);
  };

  const createBooking = (booking) => {
    const nextBooking = {
      bookingId: makeBookingId(),
      status: 'Confirmed',
      bookedAt: Date.now(),
      ...booking,
    };
    setBookings((items) => [nextBooking, ...items]);
    addNotification(`Booking confirmed: ${nextBooking.bookingId}`);
    return nextBooking;
  };

  const updateBooking = (bookingId, patch) => {
    setBookings((items) => items.map((booking) => (
      booking.bookingId === bookingId ? { ...booking, ...patch } : booking
    )));
  };

  const cancelBooking = (booking) => {
    const minutesSinceBooking = (Date.now() - booking.bookedAt) / 60000;
    const fullRefund = minutesSinceBooking <= 30;
    updateBooking(booking.bookingId, {
      status: 'Cancelled',
      refundStatus: fullRefund ? 'Refund Initiated' : 'No Refund',
    });
    if (fullRefund) {
      const message = {
        id: `refund_${booking.bookingId}`,
        bookingId: booking.bookingId,
        amount: booking.totalAmount,
        createdAt: Date.now(),
        text: `Refund of Rs ${booking.totalAmount} for ${booking.bookingId} has been initiated and will reflect in 5-7 business days.`,
      };
      setRefundMessages((items) => [message, ...items.filter((item) => item.id !== message.id)]);
      addNotification(`Refund initiated for ${booking.bookingId}`);
    }
    return fullRefund;
  };

  const toggleFavorite = (providerId) => {
    setFavorites((items) => (
      items.includes(providerId) ? items.filter((id) => id !== providerId) : [...items, providerId]
    ));
  };

  const addReview = (review) => {
    setReviews((items) => [{ id: `review_${Date.now()}`, createdAt: Date.now(), ...review }, ...items]);
  };

  const dismissRefundMessage = (id) => setRefundMessages((items) => items.filter((item) => item.id !== id));

  const value = {
    cities: CITIES,
    providers: PROVIDERS,
    currentUser,
    setCurrentUser,
    logout,
    selectedCity,
    setSelectedCity,
    bookings,
    createBooking,
    updateBooking,
    cancelBooking,
    notifications,
    setNotifications,
    addNotification,
    favorites,
    toggleFavorite,
    reviews,
    addReview,
    addresses,
    setAddresses,
    refundMessages,
    dismissRefundMessage,
    theme,
    toggleTheme: () => setTheme((mode) => (mode === 'dark' ? 'light' : 'dark')),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);

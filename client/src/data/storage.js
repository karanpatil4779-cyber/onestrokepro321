const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const keys = {
  currentUser: 'osp_current_user',
  selectedCity: 'osp_selected_city',
  bookings: 'osp_bookings',
  notifications: 'osp_notifications',
  favorites: 'osp_favorites',
  reviews: 'osp_reviews',
  addresses: 'osp_addresses',
  refundMessages: 'osp_refund_messages',
};

export const load = (key, fallback) => readJson(key, fallback);
export const save = (key, value) => writeJson(key, value);
export const remove = (key) => localStorage.removeItem(key);

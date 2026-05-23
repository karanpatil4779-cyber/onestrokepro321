import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:5000';
const socket = io(SERVER_URL);

export default socket;

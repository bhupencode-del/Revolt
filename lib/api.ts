import axios from 'axios';

// ✅ This is your actual local IP address from earlier
const API = axios.create({
  baseURL: 'http://192.168.1.2:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;

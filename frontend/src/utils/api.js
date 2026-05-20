import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tender-surprise-production-305c.up.railway.app/api'
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
  return req;
});

export default API;
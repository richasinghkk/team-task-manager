import axios from 'axios';

const API = axios.create({
  baseURL: 'tender-surprise-production-305c.up.railway.app'
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;
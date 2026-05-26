import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 403
// api.interceptors.response.use(
//   res => res,
//   async err => {
//     const original = err.config;
//     if (err.response?.status === 403 && !original._retry) {
//       original._retry = true;
//       try {
//         const refresh = localStorage.getItem('refreshToken');
//         const { data } = await axios.post(
//           import.meta.env.VITE_API_URL + '/api/auth/refresh',
//           { refreshToken: refresh }
//         );
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         original.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(original);
//       } catch {
//         localStorage.clear();
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(err);
//   }
// );

// api.interceptors.response.use(
//   res => res,
//   async err => {
//     const original = err.config;

//     // 401 = token expired/invalid → try to refresh
//     if (err.response?.status === 401 && !original._retry) {
//       original._retry = true;
//       try {
//         const refresh = localStorage.getItem('refreshToken');
//         if (!refresh) {
//           localStorage.clear();
//           window.location.href = '/login';
//           return Promise.reject(err);
//         }
//         const { data } = await axios.post(
//           import.meta.env.VITE_API_URL + '/api/auth/refresh',
//           { refreshToken: refresh }
//         );
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('refreshToken', data.refreshToken);
//         original.headers.Authorization = `Bearer ${data.accessToken}`;
//         return api(original);
//       } catch {
//         localStorage.clear();
//         window.location.href = '/login';
//       }
//     }

//     // 403 = valid token but not authorized (e.g. student hitting admin route)
//     // Do NOT retry — just reject and let the component handle it
//     return Promise.reject(err);
//   }
// );


// ✅ Fixed — only intercepts 401 when user had an active session
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {

      // If no access token exists, this is a fresh login attempt.
      // Let the error fall through to the component's catch block
      // so it can show the appropriate toast message.
      const existingToken = localStorage.getItem('accessToken');
      if (!existingToken) {
        return Promise.reject(err);
      }

      original._retry = true;
      try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(err);
        }
        const { data } = await axios.post(
          import.meta.env.VITE_API_URL + '/api/auth/refresh',
          { refreshToken: refresh }
        );
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
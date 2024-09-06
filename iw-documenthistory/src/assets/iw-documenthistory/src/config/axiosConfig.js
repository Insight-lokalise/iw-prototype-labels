import axios from 'axios'

axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('access_token')}`;
        return config;
    },
    error => {
      if(error.response.status == 401){
        document.location.href="/insightweb/login"
      } else {
        return Promise.reject(error);
      }
    }
)
